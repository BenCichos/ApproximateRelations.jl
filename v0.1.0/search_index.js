var documenterSearchIndex = {"docs":
[{"location":"#ApproximateRelations.jl","page":"Home","title":"ApproximateRelations.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for ApproximateRelations.","category":"page"},{"location":"","page":"Home","title":"Home","text":"ApproximateRelations.jl provides tools for approximate comparisons between real numbers without any overhead. It offers both function-based and macro based syntax to fit the user's preference. The package allows for customizable tolerance levels, enabling users to perform approximate comparisons with the desired precision. The tolerance level can be adjusted globally, function-wise, block-wise or individually for each comparison.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can install ApproximateRelations.jl using Julia's package manager:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Pkg\nPkg.add(\"ApproximateRelations\")","category":"page"},{"location":"#The-approx-function","page":"Home","title":"The approx function","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The approx function is the core function of the package that allows for approximate comparions between real numbers beyond the isapprox function.","category":"page"},{"location":"","page":"Home","title":"Home","text":"info: Info\nBy default the package uses a global absolute tolerance of 1e-10 for all approximate comparisons. You can view the current global absolute tolerance by calling get_approx and change the global absolute tolerance by calling set_approx!.","category":"page"},{"location":"#Basic-usage","page":"Home","title":"Basic usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"using ApproximateRelations\nusing Test","category":"page"},{"location":"","page":"Home","title":"Home","text":"# atol=1e-10 (default)\nfirst = approx(0, <, 1e-10)\nsecond = approx(0, <, 1e-9)\nthird = approx(0, ==, 1e-10)\nfirst, second, third","category":"page"},{"location":"","page":"Home","title":"Home","text":"The function approx works with any comparison that is defined in the Base package of Julia, which includes <, <=, ==, !=, >=, >. The approx function also works with any real numbers so you can compare integers, floats, and rational and irrational numbers.","category":"page"},{"location":"#Custom-tolerance","page":"Home","title":"Custom tolerance","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"If you want to compare two numbers with a custom tolerance, you can simply use the atol keyword argument:","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = approx(1, >, 0) # atol=1e-10 (default)\nsecond = approx(1, >, 0, atol=1)\nfirst, second","category":"page"},{"location":"#Chaining-comparisons","page":"Home","title":"Chaining comparisons","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Similarly to how you can chain multiple comparisons in Julia, you can chain multiple approximations using the approx function as well","category":"page"},{"location":"","page":"Home","title":"Home","text":"approx(0, <, 1, <, 2, ==, 2 + 1e-10)","category":"page"},{"location":"#The-@approx-macro","page":"Home","title":"The @approx macro","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The @approx macro provides a convenient syntax for approximate comparisons by transforming traditional Julia comparisons into call to the approx without losing any of the readability of the original comparison but with the added benefit of approximate comparisons.","category":"page"},{"location":"#Basic-usage-2","page":"Home","title":"Basic usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"first = @approx 1 < 2\nsecond = @approx 1 == 1 + 1e-10\nthird = @approx 1 > 1 - 1e-10\nfirst, second, third","category":"page"},{"location":"#Using-@approx-with-iszero-and-isone","page":"Home","title":"Using @approx with iszero and isone","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The @approx macro also works seamlessly with Julia's built-in iszero and isone functions, allowing for approximate comparisons to zero and one. This is particularly useful when working with floating-point arithmetic where exact equality to zero or one might be difficult to achieve due to rounding errors.","category":"page"},{"location":"","page":"Home","title":"Home","text":"x = 1e-12\ny = 1 + 1e-12\n\nfirst = @approx iszero(x)\nsecond = @approx isone(y)\nfirst, second","category":"page"},{"location":"","page":"Home","title":"Home","text":"In this example, x is considered approximately zero, and y is considered approximately one, despite small deviations from the exact values.","category":"page"},{"location":"#Custom-tolerance-2","page":"Home","title":"Custom tolerance","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can specify a custom tolerance for a single comparison:","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = @approx 0.1 0 == 0.1\nsecond = @approx 0.01 0 == 0.1\nfirst, second","category":"page"},{"location":"#Chaining-comparisons-2","page":"Home","title":"Chaining comparisons","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You  can chain multiple comparisons using the @approx macro, just like with the approx function:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 0 < 1 < 2 == 2 + 1e-10","category":"page"},{"location":"","page":"Home","title":"Home","text":"and even chain mutiple boolean expressions that contain comparisons together without worries.","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = @approx 0 == 1e-10\nsecond = @approx 0 == 1e-10 && 0 < 1e-10\nfirst, second","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can also have different tolerances for each of the comparisons in a boolean expression on a single line","category":"page"},{"location":"","page":"Home","title":"Home","text":"first = @approx 0 < 1e-10\nsecond = @approx 0 < 1e-10 || @approx 1e-11 0 < 1e-10\nfirst, second","category":"page"},{"location":"#Using-@approx-with-blocks-and-function-definitions","page":"Home","title":"Using @approx with blocks and function definitions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The @approx macro can be applied to entire blocks of code or even function definitions. This is very convenient when you want to use a custom tolerance for a larger block of code or a specific function and let's the reader know immediately that the code is using approximate comparisons.","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx function is_close_to_zero(x::Real)\n    x == 0\nend\n\nfirst = is_close_to_zero(0.0 + 1e-10)\nsecond = is_close_to_zero(0.0 + 1e-9)\nfirst, second","category":"page"},{"location":"","page":"Home","title":"Home","text":"With custom tolerance:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 1e-2 function is_not_so_close_to_zero(x)\n    x == 0\nend\n\nfirst = is_not_so_close_to_zero(0.01)\nsecond = is_not_so_close_to_zero(0.1)\nfirst, second","category":"page"},{"location":"","page":"Home","title":"Home","text":"The syntax for you the @approx on begin end blocks is exactly the same as for function definitions.","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 1e-2 begin\n    first = 0 < 0.01\n    second = 0 < 0.1\n    first, second\nend","category":"page"},{"location":"#Nested-@approx-usage","page":"Home","title":"Nested @approx usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can nest @approx macros to override tolerances for specific comparisons within a larger block:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@approx 0.1 begin\n    first = 0 < 0.1\n    second = @approx 0.01 0 < 0.1\n    return first, second\nend","category":"page"},{"location":"#Usage-with-@assert-and-@test","page":"Home","title":"Usage with @assert and @test","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The @approx macro also works with @assert and @test making it the perfect choice for writing tests that involve approximate comparisons.","category":"page"},{"location":"","page":"Home","title":"Home","text":"  @approx @assert 0 == 1e-10\n  @approx @test 0 == 1e-10","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can even use the macro with a whole @testset and it will approximate each comparison within the test set.","category":"page"},{"location":"","page":"Home","title":"Home","text":"  testset = @approx @testset  \"Approximate Tests\" begin\n    @test 0 == 1e-10\n    @approx 1e-11 @test 0 < 1e-10\n  end\n  println(stderr, testset) # hide","category":"page"},{"location":"#Setting-global-tolerance","page":"Home","title":"Setting global tolerance","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can set a global default tolerance using set_approx!:","category":"page"},{"location":"","page":"Home","title":"Home","text":"set_approx!(1e-5)","category":"page"},{"location":"","page":"Home","title":"Home","text":"To retrieve the current global tolerance:","category":"page"},{"location":"","page":"Home","title":"Home","text":"get_approx()","category":"page"},{"location":"","page":"Home","title":"Home","text":"This global tolerance will be used by default in all approx and @approx calls unless overridden locally.","category":"page"},{"location":"#Setting-the-filter-for-macroexpand","page":"Home","title":"Setting the filter for macroexpand","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"By default the @approx macro expands all any inner macro call before applying the @approx macro call. This has the benefit that any existing macro calls will perform the same without any conflict with @approx and that we can nest multiple @approx calls if needed. However, sometimes you may want to apply @approx before other macros, e.g. we filter out the @test macro such that the @approx macro is apply before the @test macro.  Currently you can only filter macro calls on a global level by using set_expand_filter!:","category":"page"},{"location":"","page":"Home","title":"Home","text":"set_expand_filter!(Symbol(\"@show\"), Symbol(\"@warn\"))","category":"page"},{"location":"","page":"Home","title":"Home","text":"To retrieve the current list of macros that are filtered","category":"page"},{"location":"","page":"Home","title":"Home","text":"get_expand_filter()","category":"page"},{"location":"#Conclusion","page":"Home","title":"Conclusion","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"ApproximateRelations.jl provides a flexible and intuitive way to perform approximate comparisons in Julia. Whether you prefer function calls or macro-based syntax, you can easily integrate approximate relations into your numerical computations with customizable precision.","category":"page"},{"location":"docstrings/#Docstrings","page":"Docstrings","title":"Docstrings","text":"","category":"section"},{"location":"docstrings/","page":"Docstrings","title":"Docstrings","text":"CurrentModule = ApproximateRelations","category":"page"},{"location":"docstrings/","page":"Docstrings","title":"Docstrings","text":"@approx\napprox\nget_approx\nset_approx!\nget_expand_filter\nset_expand_filter!\nexpand\nwalkexpr\nCOMPARISON_FUNCTIONS\nCOMPARISON_TYPES","category":"page"},{"location":"docstrings/#ApproximateRelations.@approx","page":"Docstrings","title":"ApproximateRelations.@approx","text":"@approx [atol] expr\n\nMacro for performing approximate comparisons with optional tolerance.\n\nArguments\n\natol::Real: (Optional) The absolute tolerance for comparisons. If not provided, uses the global tolerance set by set_approx!.\nexpr: The expression to evaluate using approximate comparisons.\n\nDescription\n\nThis macro allows for approximate comparisons in expressions. It supports standard comparison operators (<, <=, >, >=, ==, !=) as well as iszero and isone checks. The macro walks through the expression, replacing standard comparisons with calls to the approx function.\n\nWhen used without an explicit tolerance, it uses the global tolerance set by set_approx!.\n\nExamples\n\n@approx 1.0 == 1.000001  # Uses global tolerance\n@approx 1e-5 1.0 == 1.000001  # Uses specified tolerance of 1e-5\n@approx 0 < x < 1  # Chained comparison\n@approx iszero(1e-10) || isone(0.999999999) # Checks if x is approximately zero\n\n\n\n\n\n","category":"macro"},{"location":"docstrings/#ApproximateRelations.approx","page":"Docstrings","title":"ApproximateRelations.approx","text":"approx(v1::Real, cmp::COMPARISON_TYPES, v2::Real; atol::Real=get_approx()) -> Bool\napprox(v1::Real, cmp::COMPARISON_TYPES, v2::Real, args::Vararg{Union{COMPARISON_TYPES,Real}}; atol::Real=get_approx()) -> Bool\n\nPerform approximate comparison between real numbers using the specified comparison operator.\n\nArguments\n\nv1::Real: First value to compare\ncmp::COMPARISON_TYPES: Comparison operator (:<, :<=, :>, :>=, :(==), :!=)\nv2::Real: Second value to compare\nargs::Vararg{Union{COMPARISON_TYPES,Real}}: Additional comparisons to chain (optional)\natol::Real=get_approx(): Absolute tolerance for comparison (keyword argument)\n\nReturns\n\nBool: Result of the approximate comparison\n\nDescription\n\nThis function performs approximate comparisons between real numbers using the specified comparison operator and an absolute tolerance. It supports chaining multiple comparisons and uses the global tolerance set by set_approx! if no specific tolerance is provided.\n\nThe comparison is considered approximate within the specified tolerance. For equality comparisons, isapprox is used internally.\n\nExamples\n\napprox(1.0, ==, 1.000001; atol=1e-5)  # Returns true\napprox(1.0, <, 2.9, <, 3.0; atol=0.1)           # Returns false\napprox(1.0, ==, 1.1)                  # Returns false (using default tolerance)\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#ApproximateRelations.get_approx","page":"Docstrings","title":"ApproximateRelations.get_approx","text":"    get_approx() -> Real\n\nThis function returns the current global absolute tolerance on the approximate comparison operators as set by the set_approx! function.\n\nReturns\n\nReal - current global absolute tolerance on approximate comparison operators\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#ApproximateRelations.set_approx!","page":"Docstrings","title":"ApproximateRelations.set_approx!","text":"    set_approx!(atol::Real) -> Real\n\nThis function sets the current global absolute tolerance on the approximate comparison operators.\n\nArguments\n\natol::Real: the global absolute tolerance\n\nReturns\n\natol::Real: the new global absolute tolerance\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#ApproximateRelations.get_expand_filter","page":"Docstrings","title":"ApproximateRelations.get_expand_filter","text":"    get_expand_filter() -> Tuple{Vararg{Symbol}}\n\nThis function returns the current global filter for macro expansion in the approximate comparison operators.\n\nReturns\n\nTuple{Vararg{Symbol}} - current global filter for macro expansion\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#ApproximateRelations.set_expand_filter!","page":"Docstrings","title":"ApproximateRelations.set_expand_filter!","text":"    set_expand_filter!(macro_symbols::Symbol...) -> Tuple{Vararg{Symbol}}\n\nThis function sets the current global filter for macro expansion in the approximate comparison operators.\n\nArguments\n\nmacro_symbols::Vararg{Symbol}: the macro symbols to be filtered\n\nReturns\n\nTuple{Vararg{Symbol}}: the new global filter for macro expansion\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#ApproximateRelations.expand","page":"Docstrings","title":"ApproximateRelations.expand","text":"    expand(__module__::Module, expr::Expr) -> Expr\n\nExpand a macro expression if it's not in the expansion filter.\n\nArguments\n\n__module__::Module: The module in which to expand the macro\nexpr::Expr: The expression to potentially expand\n\nReturns\n\nExpr: The expanded expression if it's a macro call not in the filter, otherwise the original expression\n\nDescription\n\nThis function checks if the given expression is a macro call. If it is, and the macro is not in the expansion filter (as determined by get_expand_filter()), it expands the macro non-recursively. If the expression is not a macro call or is in the filter, it returns the original expression unchanged.\n\nExamples\n\nmodule MyModule\n    macro my_macro(x)\n        :(2 * $x)\n    end\nend\n\nexpr = :(MyModule.@my_macro(5))\nexpanded = expand(MyModule, expr)\n# Returns :(2 * 5) if @my_macro is not in the expansion filter\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#ApproximateRelations.walkexpr","page":"Docstrings","title":"ApproximateRelations.walkexpr","text":"walkexpr(f::Function, x) -> Any\n\nWalk through an expression and its child expressions, applying a function to each.\n\nArguments\n\nf::Function: The function to apply to each expression\nx: The expression to walk through\n\nReturns\n\nThe result of applying f to x and recursively to its child expressions\n\nDescription\n\nThis function traverses an expression x and its nested expressions, applying the function f to each. It does not descend into individual symbols within the expressions. For non-expression inputs, it simply returns the input unchanged.\n\nIf x is an Expr, the function f is applied to x, and then walkexpr is recursively called on each argument of x.\n\nExamples\n\nexpr = :(a + b * (c - d))\nwalkexpr(expr) do e\n    @show e\n    e\nend\n\n\n\n\n\n","category":"function"},{"location":"docstrings/#ApproximateRelations.COMPARISON_FUNCTIONS","page":"Docstrings","title":"ApproximateRelations.COMPARISON_FUNCTIONS","text":"    const COMPARISON_FUNCTIONS\n\nA tuple containing the symbols for comparison functions.\n\nThis constant defines a set of symbols representing the standard comparison operators in Julia. It includes the following symbols: :<, :<=, :>, :>=, :(==), and :!=.\n\nThese symbols are used within the module to identify and handle comparison operations in the context of approximate equality checks and related functionalities.\n\n\n\n\n\n","category":"constant"},{"location":"docstrings/#ApproximateRelations.COMPARISON_TYPES","page":"Docstrings","title":"ApproximateRelations.COMPARISON_TYPES","text":"    const COMPARISON_FUNCTIONS_TYPES\n\nA tuple containing the types of comparison functions.\n\nThis constant defines a set of types representing the standard comparison operators in Julia. It includes the following types: typeof(<), typeof(<=), typeof(>), typeof(>=), typeof(==), and typeof(!=).\n\nThese types are used within the module to specify the type of comparison operations in function signatures and other type-related contexts for approximate equality checks and related functionalities.\n\n\n\n\n\n","category":"type"}]
}
