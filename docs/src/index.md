# ApproximateRelations.jl

Documentation for [ApproximateRelations](https://github.com/BenCichos/ApproximateRelations.jl).

ApproximateRelations.jl provides tools for approximate comparisons between real numbers without any overhead. It offers both function-based and macro based syntax to fit the user's preference. The package allows for customizable tolerance levels, enabling users to perform approximate comparisons with the desired precision. The tolerance level can be adjusted globally, function-wise, block-wise or individually for each comparison.

## Installation

You can install ApproximateRelations.jl using Julia's package manager:

```
using Pkg
Pkg.add("ApproximateRelations")
```

## The ```approx``` function

The ```approx``` function is the core function of the package that allows for approximate comparions between real numbers beyond the ```isapprox``` function.

!!! info
    By default the package uses a global absolute tolerance of ```1e-10``` for all approximate comparisons. You can view the current global absolute tolerance by calling ```get_approx``` and change the global absolute tolerance by calling ```set_approx!```.

### Basic usage

```@setup tests
using ApproximateRelations
using Test
```

```@example tests
# atol=1e-10 (default)
first = approx(0, <, 1e-10)
second = approx(0, <, 1e-9)
third = approx(0, ==, 1e-10)
first, second, third
```

The function approx works with any comparison that is defined in the Base package of Julia, which includes ```<, <=, ==, !=, >=, >```. The approx function also works with any real numbers so you can compare integers, floats, and rational and irrational numbers.

### Custom tolerance

If you want to compare two numbers with a custom tolerance, you can simply use the ```atol``` keyword argument:

```@example tests
first = approx(1, >, 0) # atol=1e-10 (default)
second = approx(1, >, 0, atol=1)
first, second
```

### Chaining comparisons

Similarly to how you can chain multiple comparisons in Julia, you can chain multiple approximations using the approx function as well

```@example tests
approx(0, <, 1, <, 2, ==, 2 + 1e-10)
```

## The `@approx` macro

The ```@approx``` macro provides a convenient syntax for approximate comparisons by transforming traditional Julia comparisons into call to the ```approx``` without losing any of the readability of the original comparison but with the added benefit of approximate comparisons.

### Basic usage

```@example tests
first = @approx 1 < 2
second = @approx 1 == 1 + 1e-10
third = @approx 1 > 1 - 1e-10
first, second, third
```

### Using `@approx` with `iszero` and `isone`

The `@approx` macro also works seamlessly with Julia's built-in `iszero` and `isone` functions, allowing for approximate comparisons to zero and one. This is particularly useful when working with floating-point arithmetic where exact equality to zero or one might be difficult to achieve due to rounding errors.

```@example tests
x = 1e-12
y = 1 + 1e-12

first = @approx iszero(x)
second = @approx isone(y)
first, second
```

In this example, `x` is considered approximately zero, and `y` is considered approximately one, despite small deviations from the exact values.

### Custom tolerance

You can specify a custom tolerance for a single comparison:

```@example tests
first = @approx 0.1 0 == 0.1
second = @approx 0.01 0 == 0.1
first, second
```

### Chaining comparisons

You  can chain multiple comparisons using the `@approx` macro, just like with the `approx` function:

```@example tests
@approx 0 < 1 < 2 == 2 + 1e-10
```

and even chain mutiple boolean expressions that contain comparisons together without worries.

```@example tests
first = @approx 0 == 1e-10
second = @approx 0 == 1e-10 && 0 < 1e-10
first, second
```

You can also have different tolerances for each of the comparisons in a boolean expression on a single line

```@example tests
first = @approx 0 < 1e-10
second = @approx 0 < 1e-10 || @approx 1e-11 0 < 1e-10
first, second
```

### Using ```@approx``` with blocks and function definitions

The ```@approx``` macro can be applied to entire blocks of code or even function definitions. This is very convenient when you want to use a custom tolerance for a larger block of code or a specific function and let's the reader know immediately that the code is using approximate comparisons.

```@example tests
@approx function is_close_to_zero(x::Real)
    x == 0
end

first = is_close_to_zero(0.0 + 1e-10)
second = is_close_to_zero(0.0 + 1e-9)
first, second
```

With custom tolerance:

```@example tests
@approx 1e-2 function is_not_so_close_to_zero(x)
    x == 0
end

first = is_not_so_close_to_zero(0.01)
second = is_not_so_close_to_zero(0.1)
first, second
```

The syntax for you the ```@approx``` on begin end blocks is exactly the same as for function definitions.

```@example tests
@approx 1e-2 begin
    first = 0 < 0.01
    second = 0 < 0.1
    first, second
end
```

### Nested ```@approx``` usage

You can nest ```@approx``` macros to override tolerances for specific comparisons within a larger block:

```@example tests
@approx 0.1 begin
    first = 0 < 0.1
    second = @approx 0.01 0 < 0.1
    return first, second
end
```

### Usage with ```@assert``` and ```@test```

The ```@approx``` macro also works with ```@assert``` and ```@test``` making it the perfect choice for writing tests that involve approximate comparisons.

```@example tests
  @approx @assert 0 == 1e-10
  @approx @test 0 == 1e-10
```

You can even use the macro with a whole ```@testset``` and it will approximate each comparison within the test set.

```@example tests
  testset = @approx @testset  "Approximate Tests" begin
    @test 0 == 1e-10
    @approx 1e-11 @test 0 < 1e-10
  end
  println(stderr, testset) # hide
```

## Setting global tolerance

You can set a global default tolerance using ```set_approx!```:

```@example tests
set_approx!(1e-5)
```

To retrieve the current global tolerance:

```@example tests
get_approx()
```

This global tolerance will be used by default in all ```approx``` and ```@approx``` calls unless overridden locally.


## Setting the filter for macroexpand

By default the ```@approx``` macro expands all any inner macro call before applying the ```@approx``` macro call. This has the benefit that any existing macro calls will perform the same without any conflict with ```@approx``` and that we can nest multiple ```@approx``` calls if needed. However, sometimes you may want to apply ```@approx``` before other macros, e.g. we filter out the ```@test``` macro such that the ```@approx``` macro is apply before the ```@test``` macro.  Currently you can only filter macro calls on a global level by using ```set_expand_filter!```:


```@example tests
set_expand_filter!(Symbol("@show"), Symbol("@warn"))
```

To retrieve the current list of macros that are filtered

```@example tests
get_expand_filter()
```

## Conclusion

ApproximateRelations.jl provides a flexible and intuitive way to perform approximate comparisons in Julia. Whether you prefer function calls or macro-based syntax, you can easily integrate approximate relations into your numerical computations with customizable precision.
