using ApproximateRelations
using Test

@testset "ApproximateRelations.jl" begin
    @testset "Global tolerance setting" begin
        original_tolerance = get_approx()

        @test set_approx!(1e-5) == 1e-5
        @test get_approx() == 1e-5

        @test set_approx!(1e-10) == 1e-10
        @test get_approx() == 1e-10

        set_approx!(original_tolerance)
    end

    @testset "approx function" begin
        @test approx(1.0, ==, 1.000001, atol=1e-5)
        @test approx(1.0, !=, 1.000001, atol=1e-7)
        @test approx(1.0, <, 1.1)
        @test approx(1.1, >, 1.0)
        @test approx(1.0, <=, 1.000001)
        @test approx(1.000001, >=, 1.0)
        @test approx(1.0, !=, 1.1)
        @test approx(1.0, <, 1.5, <, 2.0)
        @test !approx(1.0, <, 1.5, <, 1.4)
    end

    @testset "@approx macro" begin
        @test @approx 1e-5 1.0 == 1.000001
        @test @approx 1e-7 1.0 != 1.000001
        @test @approx 0 < 1e-9 < 1
        @test @approx iszero(1e-11)
        @test @approx isone(0.99999999999)
        @test !@approx iszero(0.1)
        @test !@approx isone(1.1)
    end

    @testset "Chained comparisons" begin
        @test @approx 0 < 0.1 < 0.2 < 0.3
        @test !@approx 0 < 0.1 < 0.2 > 0.3
        x, y, z = 1.0, 1.000001, 1.000002
        @test @approx x < y < z
    end

    @approx @testset "Integration with @test" begin
        @test 0 == 1e-10
        @approx 1e-11 @test  0 < 1e-10
        @approx @test 1.0 != 1.1
    end

    @testset "Custom tolerance in blocks" begin
        x = 1.0099
        @approx 1e-2 begin
            @test x == 1.0
            @test 0.9 < x < 1.1
        end

        @approx 1e-3 begin
            @test !(x == 1.0)
            @test !(0.999 < x < 1.001)
        end
    end

    @testset "Edge cases" begin
        @test @approx iszero(1e-11)
        @test @approx isone(1 + 1e-11)
        @test @approx Inf > 1e100
        @test @approx -Inf < -1e100
        @test !@approx isnan(0)
    end
end
