var documenterSearchIndex = {"docs":
[{"location":"#ApproximateRelations","page":"Home","title":"ApproximateRelations","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for ApproximateRelations.","category":"page"},{"location":"","page":"Home","title":"Home","text":"ApproximateRelations.jl provides tools for approximate comparisons between real numbers without any overhead. It offers both function-based and macro based syntax to fit the user's preference. The package allows for customizable tolerance levels, enabling users to perform approximate comparisons with the desired precision. The tolerance level can be adjusted globally, function-wise, block-wise or individually for each comparison.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can install ApproximateRelations.jl using Julia's package manager:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Pkg\nPkg.add(\"ApproximateRelations\")","category":"page"},{"location":"#The-approx-function","page":"Home","title":"The approx function","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The approx function is the core function of the package that allows for approximate comparions between real numbers beyond the isapprox function.","category":"page"},{"location":"","page":"Home","title":"Home","text":"info: Info\nBy default the package uses a global absolute tolerance of 1e-10 for all approximate comparisons. You can view the current global absolute tolerance by calling get_approx and change the global absolute tolerance by calling set_approx!.","category":"page"},{"location":"#Basic-usage","page":"Home","title":"Basic usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"using ApproximateRelations\nusing Test","category":"page"},{"location":"","page":"Home","title":"Home","text":"# atol=1e-10 (default)\nfirst = approx(0, <, 1e-10)\nsecond = approx(0, <, 1e-9)\nthird = approx(0, ==, 1e-10)\nfirst, second, third","category":"page"},{"location":"","page":"Home","title":"Home","text":"The function approx works with any comparison that is defined in the Base package of Julia, which includes <, <=, ==, !=, >=, >. The approx function also works with any real numbers so you can compare integers, floats, and rational and irrational numbers.","category":"page"},{"location":"#Custom-tolerance","page":"Home","title":"Custom tolerance","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"If you want to compare two numbers with a custom tolerance, you can simply use the atol keyword argument:","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = approx(1, >, 0) # atol=1e-10 (default)\nsecond = approx(1, >, 0, atol=1)\nfirst, second","category":"page"},{"location":"#Chaining-comparisons","page":"Home","title":"Chaining comparisons","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Similarly to how you can chain multiple comparisons in Julia, you can chain multiple approximations using the approx function as well","category":"page"},{"location":"","page":"Home","title":"Home","text":"approx(0, <, 1, <, 2, ==, 2 + 1e-10)","category":"page"},{"location":"#The-@approx-macro","page":"Home","title":"The @approx macro","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The @approx macro provides a convenient syntax for approximate comparisons by transforming traditional Julia comparisons into call to the approx without losing any of the readability of the original comparison but with the added benefit of approximate comparisons.","category":"page"},{"location":"#Basic-usage-2","page":"Home","title":"Basic usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"first = @approx 1 < 2\nsecond = @approx 1 == 1 + 1e-10\nthird = @approx 1 > 1 - 1e-10\nfirst, second, third","category":"page"},{"location":"#Custom-tolerance-2","page":"Home","title":"Custom tolerance","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can specify a custom tolerance for a single comparison:","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = @approx 0.1 0 == 0.1\nsecond = @approx 0.01 0 == 0.1\nfirst, second","category":"page"},{"location":"#Chaining-comparisons-2","page":"Home","title":"Chaining comparisons","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You  can chain multiple comparisons using the @approx macro, just like with the approx function:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 0 < 1 < 2 == 2 + 1e-10","category":"page"},{"location":"","page":"Home","title":"Home","text":"and even chain mutiple boolean expressions that contain comparisons together without worries.","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = @approx 0 == 1e-10\nsecond = @approx 0 == 1e-10 && 0 < 1e-10\nfirst, second","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can also have different tolerances for each of the comparisons in a boolean expression on a single line","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = @approx 0 < 1e-10\nsecond = @approx 0 < 1e-10 || @approx 1e-11 0 < 1e-10\nfirst, second","category":"page"},{"location":"#Using-@approx-with-blocks-and-function-definitions","page":"Home","title":"Using @approx with blocks and function definitions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The @approx macro can be applied to entire blocks of code or even function definitions. This is very convenient when you want to use a custom tolerance for a larger block of code or a specific function and let's the reader know immediately that the code is using approximate comparisons.","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx function is_close_to_zero(x::Real)\n    x == 0\nend\n\nfirst = is_close_to_zero(0.0 + 1e-10)\nsecond = is_close_to_zero(0.0 + 1e-9)\nfirst, second","category":"page"},{"location":"","page":"Home","title":"Home","text":"With custom tolerance:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 1e-2 function is_not_so_close_to_zero(x)\n    x == 0\nend\n\nfirst = is_not_so_close_to_zero(0.01)\nsecond = is_not_so_close_to_zero(0.1)\nfirst, second","category":"page"},{"location":"","page":"Home","title":"Home","text":"The syntax for you the @approx on begin end blocks is exactly the same as for function definitions.","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 1e-2 begin\n    first = 0 < 0.01\n    second = 0 < 0.1\n    first, second\nend","category":"page"},{"location":"#Nested-@approx-usage","page":"Home","title":"Nested @approx usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can nest @approx macros to override tolerances for specific comparisons within a larger block:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 0.1 begin\n    first = 0 < 0.1\n    second = @approx 0.01 0 < 0.1\n    return first, second\nend","category":"page"},{"location":"#Usage-with-@assert-and-@test","page":"Home","title":"Usage with @assert and @test","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The @approx macro also works with @assert and @test making it the perfect choice for writing tests that involve approximate comparisons.","category":"page"},{"location":"","page":"Home","title":"Home","text":"  @approx @assert 0 == 1e-10\n  @approx @test 0 == 1e-10","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can even use the macro with a whole @testset and it will approximate each comparison within the test set.","category":"page"},{"location":"","page":"Home","title":"Home","text":"  testset = @approx @testset  \"Approximate Tests\" begin\n    @test 0 == 1e-10\n    @approx 1e-11 @test 0 < 1e-10\n  end\n  println(stderr, testset) # hide","category":"page"},{"location":"#Setting-global-tolerance","page":"Home","title":"Setting global tolerance","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can set a global default tolerance using set_approx!:","category":"page"},{"location":"","page":"Home","title":"Home","text":"set_approx!(1e-5)","category":"page"},{"location":"","page":"Home","title":"Home","text":"To retrieve the current global tolerance:","category":"page"},{"location":"","page":"Home","title":"Home","text":"get_approx()","category":"page"},{"location":"","page":"Home","title":"Home","text":"This global tolerance will be used by default in all approx and @approx calls unless overridden locally.","category":"page"},{"location":"#Setting-the-filter-for-macroexpand","page":"Home","title":"Setting the filter for macroexpand","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"By default the @approx macro expands all any inner macro call before applying the @approx macro call. This has the benefit that any existing macro calls will perform the same without any conflict with @approx and that we can nest multiple @approx calls if needed. However, sometimes you may want to apply @approx before other macros, e.g. we filter out the @test macro such that the @approx macro is apply before the @test macro.  Currently you can only filter macro calls on a global level by using set_expand_filter!:","category":"page"},{"location":"","page":"Home","title":"Home","text":"set_expand_filter!(Symbol(\"@show\"), Symbol(\"@warn\"))","category":"page"},{"location":"","page":"Home","title":"Home","text":"To retrieve the current list of macros that are filtered","category":"page"},{"location":"","page":"Home","title":"Home","text":"get_expand_filter()","category":"page"},{"location":"#Conclusion","page":"Home","title":"Conclusion","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"ApproximateRelations.jl provides a flexible and intuitive way to perform approximate comparisons in Julia. Whether you prefer function calls or macro-based syntax, you can easily integrate approximate relations into your numerical computations with customizable precision.","category":"page"}]
}
