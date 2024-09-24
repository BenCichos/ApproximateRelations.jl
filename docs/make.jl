using ApproximateRelations
using Documenter

DocMeta.setdocmeta!(ApproximateRelations, :DocTestSetup, :(using ApproximateRelations); recursive=true)

makedocs(;
    modules=[ApproximateRelations],
    authors="“BenCichos” <“b.cichos@me.com”> and contributors",
    sitename="ApproximateRelations.jl",
    format=Documenter.HTML(;
        canonical="https://BenCichos.github.io/ApproximateRelations.jl",
        edit_link="main",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
    ],
)

deploydocs(;
    repo="github.com/BenCichos/ApproximateRelations.jl",
    devbranch="main",
)
