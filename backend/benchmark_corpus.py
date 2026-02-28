# Benchmark Corpus for TruthLens
# Contains 3 categories of text: Verified, Hallucinated, Mixed.

BENCHMARK_CORPUS = [
    {
        "id": "verified_01",
        "category": "verified",
        "text": "The Apollo 11 mission was the first spaceflight that landed the first two people on the Moon. Commander Neil Armstrong and lunar module pilot Buzz Aldrin landed the Apollo Lunar Module Eagle on July 20, 1969, at 20:17 UTC.",
        "expected_risk_min": 0,
        "expected_risk_max": 20,
        "description": "Historical fact (Wikipedia style)"
    },
    {
        "id": "verified_02",
        "category": "verified",
        "text": "Water boils at 100 degrees Celsius at standard atmospheric pressure. It freezes at 0 degrees Celsius.",
        "expected_risk_min": 0,
        "expected_risk_max": 15,
        "description": "Scientific fact"
    },
    {
        "id": "hallucinated_01",
        "category": "hallucinated",
        "text": "A recent study by the Mars Institute confirmed that 78% of the Martian surface is covered in moss. Dr. Elena Vance led this breakthrough discovery in 2024.",
        "expected_risk_min": 70,
        "expected_risk_max": 100,
        "description": "Fabricated study and stats"
    },
    {
        "id": "hallucinated_02",
        "category": "hallucinated",
        "text": "Elon Musk announced yesterday that Tesla will be acquiring Ford Motor Company for $450 billion. The merger is expected to close by Q4 2025.",
        "expected_risk_min": 85,
        "expected_risk_max": 100,
        "description": "Fabricated major news event"
    },
    {
        "id": "mixed_01",
        "category": "mixed",
        "text": "Apple released the iPhone 15 in September 2023. Analysts believe it is the best phone ever made and will cure smartphone addiction within two years.",
        "expected_risk_min": 30,
        "expected_risk_max": 65,
        "description": "Fact mixed with heavy speculation/opinion"
    },
    {
        "id": "mixed_02",
        "category": "mixed",
        "text": "The Eiffel Tower is in Paris. It was built in 1889. Rumors suggest the French government plans to disassemble it in 2030 to build a giant statue of a baguette.",
        "expected_risk_min": 40,
        "expected_risk_max": 80,
        "description": "Facts mixed with absurd fabrication"
    }
]
