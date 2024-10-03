using ApproximateRelations
using Documenter

DocMeta.setdocmeta!(ApproximateRelations, :DocTestSetup, :(using ApproximateRelations); recursive=true)

makedocs(;
    authors="“BenCichos” <“b.cichos@me.com”> and contributors",
    sitename="ApproximateRelations.jl",
    pages = [
            "Home" => "index.md"
            "Docstrings" => "docstrings.md"
        ]
)

deploydocs(;
    repo="github.com/BenCichos/ApproximateRelations.jl",
    devbranch="main",
)
