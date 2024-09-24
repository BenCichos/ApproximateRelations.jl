module ApproximateRelations

using Base: isapprox

function get_approx end
function set_approx! end

set_approx!(atol::Real) = :(get_approx() = $atol) |> eval

const COMPARISON_FUNCTIONS = (:<, :<=, :>, :>=, :(==), :!=)
const COMPARISON_TYPES = Union{typeof(<),typeof(<=),typeof(>),typeof(>=),typeof(==),typeof(!=)}

approx(v1::Real, ::typeof(<), v2::Real; atol::Real=get_approx()) = v1 < v2 - atol
approx(v1::Real, ::typeof(<=), v2::Real; atol::Real=get_approx()) = approx(v1, <, v2, atol=atol) || approx(v1, ==, v2, atol=atol)
approx(v1::Real, ::typeof(>), v2::Real; atol::Real=get_approx()) = v1 - atol > v2
approx(v1::Real, ::typeof(>=), v2::Real; atol::Real=get_approx()) = approx(v1, >, v2, atol=atol) || approx(v1, ==, v2, atol=atol)
approx(v1::Real, ::typeof(==), v2::Real; atol::Real=get_approx()) = isapprox(v1, v2, atol=atol)
approx(v1::Real, ::typeof(!=), v2::Real; atol::Real=get_approx()) = !isapprox(v1, v2, atol=atol)

function approx(v1::Real, cmp::COMPARISON_TYPES, v2::Real, args::Vararg{Union{COMPARISON_TYPES,Real}}; atol::Real=get_approx())
    next, next_args = args[1:2], args[3:end]
    approx(v1, cmp, v2; atol=atol) || return false
    approx(v2, next..., next_args...; atol=atol)
end

walk(x, ::Function) = x
walk(x::Expr, inner::Function) = Expr(x.head, map(inner, x.args)...)
walk(f::Function, x) = walk(f(x), x -> walk(f, x))

macro approx(atol::Real, expr::Expr)
    walk(macroexpand(__module__, expr)) do ex
        ex isa Expr || return ex
        head, args = ex.head, ex.args
        if head == :call
            first_arg = first(args)
            first_arg in COMPARISON_FUNCTIONS && return :(approx($(args[2]), $(first_arg), $(args[3]); atol=$atol))
            first_arg == :iszero && return :(approx(zero(typeof($(args[2]))), $(:(==)), $(args[2]); atol=$atol))
            first_arg == :isone && return :(approx(one(typeof($(args[2]))), $(:(==)), $(args[2]); atol=$atol))
        end
        head == :comparison && return :(approx($(args[1]), $(args[2]), $(args[3:end]...); atol=$atol))
        return ex
    end |> esc
end

macro approx(ex::Expr)
    :(@approx $(get_approx()) $ex)
end

__init__() = set_approx!(1e-10)

export get_approx, set_approx!
export approx, @approx

end
