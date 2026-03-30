import json
from app.engine.blog_engine import AIBlogPipeline
from app.seo.seo_validator import SEOValidator

def main():
    pipeline = AIBlogPipeline()
    validator = SEOValidator()
    
    keywords = [
        "Blogy - Best AI Blog Automation Tool in India",
        "How Blogy is Disrupting Martech - Organic Traffic on Autopilot, Cheapest SEO"
    ]
    
    for kw in keywords:
        print(f"Generating for: {kw}")
        result = pipeline.run_pipeline(kw)
        seo_report = validator.evaluate(result["final_blog"], kw)
        
        output = {
            "keyword": kw,
            "blog_content": result["final_blog"],
            "seo_report": seo_report,
            "geo_optimization": result["geo_optimization"]
        }
        
        filename = kw.split("-")[0].strip().replace(" ", "_").lower() + "_blog.json"
        
        with open(filename, "w") as f:
            json.dump(output, f, indent=4)
        print(f"Saved to {filename}\n")

if __name__ == "__main__":
    main()
