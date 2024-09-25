module ApproximateRelations

using Base: isapprox

function get_approx end
function set_approx! end

set_approx!(atol::Real) = (:(get_approx() = $atol) |> eval; return atol)

function get_expand_filter end
function set_expand_filter! end

set_expand_filter!(macro_symbols::Symbol...) = (:(get_expand_filter() = $macro_symbols) |> eval; return macro_symbols)

const COMPARISON_FUNCTIONS = (:<, :<=, :>, :>=, :(==), :!=)
const COMPARISON_TYPES = Union{typeof(<),typeof(<=),typeof(>),typeof(>=),typeof(==),typeof(!=)}

approx(v1::Real, ::typeof(<), v2::Real; atol::Real=get_approx()) = v2 - v1 > atol
approx(v1::Real, ::typeof(<=), v2::Real; atol::Real=get_approx()) = approx(v1, <, v2, atol=atol) || approx(v1, ==, v2, atol=atol)
approx(v1::Real, ::typeof(>), v2::Real; atol::Real=get_approx()) = v1 - v2 > atol
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


function expand(__module__::Module, expr::Expr)
    expr.head == :macrocall || return expr
    expr.args[1] in get_expand_filter() && return expr
    macroexpand(__module__, expr, recursive=false)
end

macro approx(ex::Expr)
    :(@approx $(get_approx()) $ex) |> esc
end

macro approx(atol::Real, expr::Expr)
    walk(ex -> approx_expr(__module__, ex, atol), expr) |> esc
end

approx_expr(::Module, ex, ::Real) = ex
function approx_expr(__module__::Module, ex::Expr, atol::Real)
    ex = expand(__module__, ex)
    head, args = ex.head, ex.args
    if head == :call
        first_arg = first(args)
        first_arg in COMPARISON_FUNCTIONS && return :(approx($(args[2]), $(first_arg), $(args[3]); atol=$atol))
        first_arg == :iszero && return :(approx(zero(typeof($(args[2]))), $(:(==)), $(args[2]); atol=$atol))
        first_arg == :isone && return :(approx(one(typeof($(args[2]))), $(:(==)), $(args[2]); atol=$atol))
    end
    head == :comparison && return :(approx($(args[1]), $(args[2]), $(args[3:end]...); atol=$atol))
    return ex
end

__init__() = (set_approx!(1e-10); set_expand_filter!(Symbol("@test")))

export get_approx, set_approx!, set_approx_local!
export get_expand_filter, set_expand_filter!
export approx, @approx

end
