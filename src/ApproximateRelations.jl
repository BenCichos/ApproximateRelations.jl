module ApproximateRelations

@doc """
# ApproximateRelations.jl

A Julia package for performing approximate comparisons between real numbers with customizable tolerance levels at a global, function, block or individual comparison level.

## Main Features:
- Approximate comparisons using `approx` function and `@approx` macro
- Support for all standard comparison operators (`<`, `<=`, `>`, `>=`, `==`, `!=`)
- Global tolerance setting with `set_approx!` and `get_approx`
- Local tolerance setting for blocks, functions, and individual expressions
- Chained comparison support (e.g., `approx(0, <, x, 1)`, `@approx 0 < x < 1`)
- Integration with testing frameworks via `@test` and `@testset` compatibility
- Support for `iszero` and `isone` approximate checks
- Macro expansion filtering to control which macros are expanded during processing
- Flexible use in assertions and conditional statements

The package provides a powerful and flexible way to handle real number comparisons
and equality checks with customizable precision, making it ideal for numerical
computations and testing scenarios where exact equality is impractical.
""" ApproximateRelations

"""
```
    get_approx() -> Real
```

This function returns the current global absolute tolerance on the approximate comparison operators as set by the set_approx! function.

# Returns
- `Real` - current global absolute tolerance on approximate comparison operators
"""
function get_approx end

get_approx() = 1e-10

"""
```
    @set_approx! atol::Real -> Real
```

This macro sets the current global absolute tolerance on the approximate comparison operators.

# Arguments
- `atol::Real`: the global absolute tolerance

# Returns
- `atol::Real`: the new global absolute tolerance
"""
macro set_approx! end

macro set_approx!(atol)
    quote
        atol_val = $(esc(atol))
        typeof(atol_val) <: Real || error("Invalid absolute tolerance value")
        ApproximateRelations.get_approx() = atol_val
        return atol_val
    end
end

macro set_approx!(atol::Real)
    :(ApproximateRelations.get_approx() = $atol; return $atol) |> esc
end

"""
```
    get_expand_filter() -> Tuple{Vararg{Symbol}}
```

This function returns the current global filter for macro expansion in the approximate comparison operators.

# Returns
- `Tuple{Vararg{Symbol}}` - current global filter for macro expansion

"""
function get_expand_filter end

get_expand_filter() = (Symbol("@test"), Symbol("@test_throws"))

"""
```
    @set_expand_filter! macro_symbols::Expr... -> Tuple{Vararg{Symbol}}
```

This function sets the current global filter for macro expansion in the approximate comparison operators.

# Arguments
- `macro_symbols::Vararg{Symbol}`: the macro symbols to be filtered

# Returns
- `Tuple{Vararg{Symbol}}`: the new global filter for macro expansion
"""
macro set_expand_filter! end

macro set_expand_filter!(expr_tuple::Expr...)
    expr = first(expr_tuple)
    head, args = expr.head, expr.args
    head in (:tuple, :macrocall) || error("Invalid macro call expression")
    macro_symbols = (head == :tuple) ? Tuple(first(expr.args) for expr in args) : (first(expr.args),)
    esc(:(ApproximateRelations.get_expand_filter() = $macro_symbols; return $macro_symbols))
end
export @set_expand_filter!


"""
```
    const COMPARISON_FUNCTIONS
```

A tuple containing the symbols for comparison functions.

This constant defines a set of symbols representing the standard comparison operators in Julia.
It includes the following symbols: `:<`, `:<=`, `:>`, `:>=`, `:(==)`, and `:!=`.

These symbols are used within the module to identify and handle comparison operations
in the context of approximate equality checks and related functionalities.
"""
const COMPARISON_FUNCTIONS = (:<, :<=, :>, :>=, :(==), :!=)

"""
```
    const COMPARISON_FUNCTIONS_TYPES
```

A tuple containing the types of comparison functions.

This constant defines a set of types representing the standard comparison operators in Julia.
It includes the following types: `typeof(<)`, `typeof(<=)`, `typeof(>)`, `typeof(>=)`, `typeof(==)`, and `typeof(!=)`.

These types are used within the module to specify the type of comparison operations
in function signatures and other type-related contexts for approximate equality checks and related functionalities.
"""
const COMPARISON_TYPES = Union{typeof(<),typeof(<=),typeof(>),typeof(>=),typeof(==),typeof(!=)}


"""
    approx(v1::Real, cmp::COMPARISON_TYPES, v2::Real; atol::Real=get_approx()) -> Bool
    approx(v1::Real, cmp::COMPARISON_TYPES, v2::Real, args::Vararg{Union{COMPARISON_TYPES,Real}}; atol::Real=get_approx()) -> Bool

Perform approximate comparison between real numbers using the specified comparison operator.

# Arguments
- `v1::Real`: First value to compare
- `cmp::COMPARISON_TYPES`: Comparison operator (:<, :<=, :>, :>=, :(==), :!=)
- `v2::Real`: Second value to compare
- `args::Vararg{Union{COMPARISON_TYPES,Real}}`: Additional comparisons to chain (optional)
- `atol::Real=get_approx()`: Absolute tolerance for comparison (keyword argument)

# Returns
- `Bool`: Result of the approximate comparison

# Description
This function performs approximate comparisons between real numbers using the specified comparison operator and an absolute tolerance. It supports chaining multiple comparisons and uses the global tolerance set by `set_approx!` if no specific tolerance is provided.

The comparison is considered approximate within the specified tolerance. For equality comparisons, `isapprox` is used internally.

# Examples
```
approx(1.0, ==, 1.000001; atol=1e-5)  # Returns true
approx(1.0, <, 2.9, <, 3.0; atol=0.1)           # Returns false
approx(1.0, ==, 1.1)                  # Returns false (using default tolerance)
```
"""
function approx end

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



"""
    walkexpr(f::Function, x) -> Any

Walk through an expression and its child expressions, applying a function to each.

# Arguments
- `f::Function`: The function to apply to each expression
- `x`: The expression to walk through

# Returns
- The result of applying `f` to `x` and recursively to its child expressions

# Description
This function traverses an expression `x` and its nested expressions, applying the function `f`
to each. It does not descend into individual symbols within the expressions. For non-expression
inputs, it simply returns the input unchanged.

If `x` is an `Expr`, the function `f` is applied to `x`, and then `walkexpr` is recursively
called on each argument of `x`.

# Examples
```
expr = :(a + b * (c - d))
walkexpr(expr) do e
    @show e
    e
end
```
"""
function walkexpr end

walkexpr(::Function, x) = x
walkexpr(f::Function, x::Expr) = f(x) |> x -> Expr(x.head, map(arg -> walkexpr(f, arg), x.args)...)


"""
```
    expand(__module__::Module, expr::Expr) -> Expr
```

Expand a macro expression if it's not in the expansion filter.

# Arguments
- `__module__::Module`: The module in which to expand the macro
- `expr::Expr`: The expression to potentially expand

# Returns
- `Expr`: The expanded expression if it's a macro call not in the filter, otherwise the original expression

# Description
This function checks if the given expression is a macro call. If it is, and the macro is not
in the expansion filter (as determined by `get_expand_filter()`), it expands the macro
non-recursively. If the expression is not a macro call or is in the filter, it returns
the original expression unchanged.

# Examples
```
module MyModule
    macro my_macro(x)
        :(2 * \$x)
    end
end

expr = :(MyModule.@my_macro(5))
expanded = expand(MyModule, expr)
# Returns :(2 * 5) if @my_macro is not in the expansion filter
```
"""
function expand(__module__::Module, expr::Expr)
    expr.head == :macrocall || return expr
    expr.args[1] in get_expand_filter() && return expr
    macroexpand(__module__, expr, recursive=false)
end


"""
    @approx [atol] expr

Macro for performing approximate comparisons with optional tolerance.

# Arguments
- `atol::Real`: (Optional) The absolute tolerance for comparisons. If not provided, uses the global tolerance set by `set_approx!`.
- `expr`: The expression to evaluate using approximate comparisons.

# Description
This macro allows for approximate comparisons in expressions. It supports standard comparison operators
(`<`, `<=`, `>`, `>=`, `==`, `!=`) as well as `iszero` and `isone` checks. The macro walks through the
expression, replacing standard comparisons with calls to the `approx` function.

When used without an explicit tolerance, it uses the global tolerance set by `set_approx!`.

# Examples
```julia
@approx 1.0 == 1.000001  # Uses global tolerance
@approx 1e-5 1.0 == 1.000001  # Uses specified tolerance of 1e-5
@approx 0 < x < 1  # Chained comparison
@approx iszero(1e-10) || isone(0.999999999) # Checks if x is approximately zero
```
"""
macro approx end

macro approx(ex::Expr)
    :(@approx $(get_approx()) $ex) |> esc
end

macro approx(atol::Real, expr::Expr)
    walkexpr(ex -> approx_expr(__module__, ex, atol), expr) |> esc
end

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


export get_approx, @set_approx!
export get_expand_filter, @set_expand_filter!
export approx, @approx

end
