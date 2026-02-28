import asyncio
import sys
import statistics
from app.services.nli_engine import NLIEngine
from benchmark_corpus import BENCHMARK_CORPUS

async def run_benchmark():
    print("Initializing TruthLens Benchmark Suite...")
    engine = NLIEngine()
    
    results = []
    passed = 0
    total = len(BENCHMARK_CORPUS)
    
    print(f"\nRunning {total} test cases...\n")
    print(f"{'ID':<15} {'Category':<15} {'Exp Range':<15} {'Actual Score':<15} {'Status':<10}")
    print("-" * 80)
    
    scores_by_category = {"verified": [], "hallucinated": [], "mixed": []}
    
    for case in BENCHMARK_CORPUS:
        try:
            # Run analysis
            # Note: We don't pass session/user_id here so consistency guard is skipped (pure logic test)
            analysis = await engine.analyze_text(case["text"])
            score = analysis.risk_score
            
            # Check validation
            is_pass = case["expected_risk_min"] <= score <= case["expected_risk_max"]
            status = "PASS" if is_pass else "FAIL"
            if is_pass:
                passed += 1
                
            scores_by_category[case["category"]].append(score)
            results.append({
                "id": case["id"],
                "score": score,
                "pass": is_pass
            })
            
            # Print row
            range_str = f"{case['expected_risk_min']}-{case['expected_risk_max']}"
            print(f"{case['id']:<15} {case['category']:<15} {range_str:<15} {score:<15.1f} {status:<10}")
            
        except Exception as e:
            print(f"{case['id']:<15} ERROR: {str(e)}")
            
    print("-" * 80)
    
    # Summary Stats
    pass_rate = (passed / total) * 100
    print(f"\nBenchmark Summary:")
    print(f"Pass Rate: {pass_rate:.1f}% ({passed}/{total})")
    
    print("\nCategory Averages:")
    for cat, scores in scores_by_category.items():
        if scores:
            avg = statistics.mean(scores)
            print(f"  {cat.capitalize()}: {avg:.1f}")
            
    if pass_rate < 80:
        print("\n❌ Benchmark FAILED (Pass rate < 80%)")
        sys.exit(1)
    else:
        print("\n✅ Benchmark PASSED")
        sys.exit(0)

if __name__ == "__main__":
    # Load env vars if needed (assuming .env is picked up by config or manually)
    from dotenv import load_dotenv
    import os
    if os.path.exists(".env"):
        load_dotenv()
        
    asyncio.run(run_benchmark())
