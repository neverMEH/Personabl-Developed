import React, { useState, Component } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SearchIcon, ChevronRightIcon, PlugIcon, BarChart2Icon, Target } from 'lucide-react';
import { Modal } from '../../components/Modal';
const sections = [{
  id: 'market-opportunity',
  title: 'Market Opportunity Hunter',
  icon: Target,
  tags: ['Keepa'],
  content: [{
    title: 'Core Purpose',
    description: 'The Market Opportunity Hunter is designed to help you discover untapped niches and market gaps across Amazon categories. It:\n\n• Identifies underserved market segments and price points\n• Discovers emerging trends before they become saturated\n• Finds high-volume, low-competition keyword opportunities\n• Reveals seasonal windows and geographic gaps'
  }, {
    title: 'Opportunity Types',
    description: "🎯 Market Gaps\n• Underserved price points where demand exceeds supply\n• Feature combinations customers want but can't find\n• Geographic regions with unmet demand\n\n📈 Emerging Trends\n• Growing categories with accelerating sales\n• New keyword combinations gaining traction\n• Seasonal opportunities before peak competition\n\n🔍 Keyword Opportunities\n• High search volume terms with low product coverage\n• Long-tail keywords with buyer intent\n• Untapped search combinations"
  }, {
    title: 'Analysis Framework',
    description: 'The tool evaluates opportunities across five key dimensions:\n\n• Market Size: Volume and revenue potential\n• Competition Density: How saturated is the space?\n• Entry Barriers: Capital and complexity requirements\n• Growth Trajectory: Is the market expanding or contracting?\n• Profitability Potential: Estimated margins and sustainability'
  }, {
    title: 'Input Parameters',
    description: '• Category IDs: Specific categories to analyze (optional)\n• Domain ID: Amazon marketplace (1=US, 2=UK, etc.)\n• Price Range: Focus on specific price segments\n• Opportunity Type: "gaps", "trends", "keywords", or "all"\n• Competition Level: "low", "medium", "high", or "all"'
  }, {
    title: 'Sample Prompts',
    description: '1. General Market Discovery\n"Find market opportunities in Amazon US across all categories with low competition"\n\n2. Category-Specific Gap Analysis\n"Show me market gaps in Home & Kitchen (category 1063498) and Sports & Outdoors (3375251) between $20-$100"\n\n3. Emerging Trends Search\n"What are the emerging trends in Electronics (16318031) with medium competition levels?"\n\n4. Keyword Opportunity Hunt\n"Find keyword opportunities in the Pet Supplies category with products priced $15-$50"\n\n5. Low Competition Entry Points\n"Identify low competition opportunities across all categories with products under $30"\n\n6. Premium Market Gaps\n"Show market gaps for products priced $100-$500 with low to medium competition"\n\n7. Multi-Category Analysis\n"Analyze opportunities in categories 16318031,1063498,3375251 focusing on gaps in the $25-$150 range"\n\n8. Comprehensive Market Scan\n"Run a comprehensive opportunity analysis for all types in the US market, focusing on low competition areas"'
  }, {
    title: 'Expected Output Format',
    description: 'The tool provides:\n\n🎯 TOP OPPORTUNITIES\n├── High-Impact, Low-Competition\n├── Emerging Market Trends\n├── Keyword Gaps\n└── Seasonal Windows\n\n📊 OPPORTUNITY SCORING\n├── Market Size: ⭐⭐⭐⭐⭐\n├── Competition: ⭐⭐⭐\n├── Entry Ease: ⭐⭐⭐⭐\n└── Profitability: ⭐⭐⭐⭐\n\nEach opportunity includes:\n• Specific market gap or trend identified\n• Estimated market size and growth rate\n• Current competition level\n• Recommended entry strategy\n• Potential risks and considerations'
  }, {
    title: 'Pro Tips',
    description: 'Start Broad, Then Narrow: Begin with "all" categories to discover unexpected opportunities, then focus on specific niches\n\nLayer Your Analysis: First find gaps, then run keyword analysis on those specific opportunities\n\nPrice Range Strategy: Use price ranges to find sweet spots where competition is lower but demand remains strong\n\nCompetition Level Insights: "Low" competition often means newer markets, while "medium" might offer more stability\n\nCombine with Other Tools: Use findings here as input for the Price Optimization Engine or Competitive Analysis tools\n\nWould you like me to run a Market Opportunity Hunter analysis for you? Just let me know your target categories, price range, or what type of opportunities you\'re most interested in discovering.'
  }]
}, {
  id: 'price-optimization',
  title: 'Price Optimization Engine',
  icon: BarChart2Icon,
  tags: ['Keepa'],
  content: [{
    title: 'Core Purpose',
    description: 'The Price Optimization Engine analyzes historical buy box performance across different price points, identifies optimal pricing strategies based on actual sales data, and recommends pricing that balances volume and margin for maximum cash flow.'
  }, {
    title: 'Key Features',
    description: '📊 Price Band Analysis\n• Divides historical pricing into 8 segments\n• Shows average monthly sales and cash flow for each range\n• Tracks buy box retention at each price point\n\n🎯 Strategic Recommendations\n• Optimal Cash Flow Strategy: Maximum revenue price point\n• High Volume Strategy: Lower price for maximum unit sales\n• High Margin Strategy: Higher price for maximum profit per unit\n\n📈 Performance Insights\n• Historical cash flow averages\n• Price stability assessment\n• Sales rank correlation\n• Competitive positioning analysis\n\n🚀 Implementation Roadmap\n• Phased transition plan\n• Risk mitigation strategies\n• Performance monitoring guidelines\n• Timeline and milestones'
  }, {
    title: 'Input Requirements',
    description: '• ASIN: The product you want to analyze\n• Domain ID: Amazon marketplace (1=US, 2=UK, etc.)\n• Cost Basis: Your product cost for margin calculations\n• Timeframe: Historical period to analyze (up to 365 days)\n• Analysis Depth: "light", "standard", or "comprehensive"'
  }, {
    title: 'Sample Prompts',
    description: '1. Basic Price Optimization\n"Analyze pricing for ASIN B08N5WRWNW on Amazon US. My cost is $12.50. Use the last 6 months of data."\n\n2. Comprehensive Analysis\n"Run a comprehensive price optimization for ASIN B07XYZ1234 in the US market. Product cost is $8.75, analyze the last 90 days with detailed recommendations."\n\n3. Quick 60-Day Analysis\n"What\'s the optimal price for ASIN B09ABC5678? Cost basis $15.25, look at the last 60 days, keep it light."\n\n4. New Product Launch Strategy\n"I\'m launching ASIN B0CNEW1234 with a cost of $22. Analyze the last 3 months to find the best entry price point."\n\n5. Competitive Response Analysis\n"My competitor just dropped prices on similar products. Analyze ASIN B08DEF5678 (cost $18) for the last 30 days to see if I should adjust pricing."\n\n6. Year-End Review\n"Give me a comprehensive yearly analysis for ASIN B07GHI9012. My cost is $25.50, look at the full 365 days of data."'
  }, {
    title: 'Expected Output Format',
    description: "The tool will provide:\n\n• Executive summary with recommended price\n• Detailed price band performance table\n• Monthly cash flow projections\n• Strategic recommendations for different goals\n• Step-by-step implementation plan\n\nWould you like me to run a price optimization analysis for any specific product? Just provide the ASIN, your cost basis, and I'll generate a detailed report for you."
  }]
}, {
  id: 'product-performance',
  title: 'Product Performance Tracker',
  icon: BarChart2Icon,
  tags: ['Keepa'],
  content: [{
    title: 'Core Purpose',
    description: 'The Product Performance Tracker provides comprehensive analytics to monitor product health, identify trends, and benchmark against category averages. It:\n\n• Tracks key performance metrics over time\n• Identifies positive and negative trends before they impact profitability\n• Benchmarks your products against category averages\n• Provides early warning signals for performance issues'
  }, {
    title: 'Performance Metrics Tracked',
    description: '📊 Sales Velocity\n• Sales rank movement analysis\n• Velocity changes over 30/60/90 days\n• Seasonal pattern identification\n\n💰 Price Stability\n• Price volatility measurement\n• Trend analysis (increasing/decreasing/stable)\n• Buy Box win rate tracking\n\n📈 Market Position\n• Category ranking percentile\n• Market share estimation\n• Competitive positioning changes\n\n⭐ Review Performance\n• Rating trend analysis\n• Review velocity tracking\n• Sentiment momentum indicators'
  }, {
    title: 'Scoring System',
    description: 'The tool provides:\n\n• Overall Performance Score: 0-100 composite rating\n• Category Benchmarking: Shows where you rank (top 10%, 25%, etc.)\n• Trend Indicators: Visual signals for improving/declining metrics\n• Risk Assessment: Flags performance issues requiring attention'
  }, {
    title: 'Input Parameters',
    description: '• ASIN: Product to analyze\n• Domain ID: Amazon marketplace (1=US, 2=UK, etc.)\n• Timeframe: Analysis period (up to 365 days)\n• Benchmark Category: Category ID for comparison (required)\n• Metrics Depth: "essential", "standard", or "comprehensive"'
  }, {
    title: 'Sample Prompts',
    description: '1. Basic Health Check\n"Check performance for ASIN B08N5WRWNW in the US market over the last 90 days. Benchmark against category 16318031."\n\n2. Comprehensive Analysis\n"Run a comprehensive performance analysis for ASIN B07XYZ1234, looking at 180 days of data, benchmarked against Home & Kitchen (1063498)"\n\n3. Quick 30-Day Snapshot\n"Give me essential metrics for ASIN B09ABC5678 for the last 30 days, benchmark against category 3375251"\n\n4. Long-Term Trend Analysis\n"Analyze ASIN B08DEF5678 performance over the full year (365 days) with standard metrics, benchmarked against Electronics"\n\n5. Multi-Product Comparison\n"Track performance for ASIN B07GHI9012 against Pet Supplies category (2619533) for the last 90 days"\n\n6. Problem Diagnosis\n"My sales are dropping on ASIN B0CNEW1234. Run a comprehensive 60-day analysis benchmarked against category 16318031"\n\n7. Seasonal Performance Review\n"Analyze seasonal patterns for ASIN B08MNO3456 over 180 days, standard depth, benchmark against Toys & Games (165793)"'
  }, {
    title: 'Expected Output Format',
    description: 'The tool provides:\n\n📊 PERFORMANCE DASHBOARD\n├── Overall Score: XX/100\n├── Category Rank: Top X%\n├── 30/60/90 Day Trends\n└── Risk Indicators\n\n🎯 KEY METRICS\n├── Sales Velocity: ↗️ Improving\n├── Price Stability: 📊 Stable\n├── Market Position: 📈 Growing\n└── Review Momentum: ⭐ Strong\n\n⚠️ ALERTS & OPPORTUNITIES\n├── [Specific recommendations]\n└── [Action items]'
  }, {
    title: 'Key Insights Provided',
    description: 'Performance Trends\n• Is your product gaining or losing market share?\n• Are sales accelerating or decelerating?\n• How does seasonality affect your product?\n\nCompetitive Benchmarking\n• How do you compare to category averages?\n• Are you outperforming or underperforming peers?\n• What percentile does your product rank in?\n\nRisk Indicators\n• Early warning signs of declining performance\n• Price instability alerts\n• Review velocity concerns\n• Rank volatility warnings\n\nActionable Recommendations\n• Specific steps to improve performance\n• Optimization opportunities identified\n• Timing for interventions'
  }, {
    title: 'Pro Tips',
    description: "Regular Monitoring: Run weekly or bi-weekly checks to catch trends early\n\nCategory Selection: Choose the most specific relevant category for accurate benchmarking\n\nTimeframe Strategy:\n• 30 days for quick health checks\n• 90 days for trend identification\n• 180+ days for seasonal analysis\n\nMetrics Depth Guide:\n• Essential: Quick daily monitoring\n• Standard: Weekly performance reviews\n• Comprehensive: Monthly deep dives\n\nCombine with Other Tools:\n• Poor performance? → Use Price Optimization Engine\n• Strong performance? → Use Market Opportunity Hunter to expand\n\nWould you like me to run a Product Performance analysis for any of your products? Just provide the ASIN and I'll generate a detailed performance report benchmarked against the relevant category."
  }]
}, {
  id: 'price-intelligence',
  title: 'Price Intelligence Dashboard',
  icon: BarChart2Icon,
  tags: ['Keepa'],
  content: [{
    title: 'Core Purpose',
    description: 'The Price Intelligence Dashboard provides dynamic pricing intelligence with market-based recommendations and competitor price tracking. It:\n\n• Analyzes current market positioning versus competitors\n• Calculates price elasticity to understand demand sensitivity\n• Provides optimal pricing recommendations for revenue/profit maximization\n• Tracks competitor pricing movements and patterns\n• Predicts Buy Box probability at different price points'
  }, {
    title: 'Key Analysis Features',
    description: '📍 Current Market Position\n• Where your price stands relative to competitors\n• Market share at current price point\n• Distance from Buy Box winning price\n\n📊 Price Elasticity Analysis\n• How demand changes with price adjustments\n• Sweet spots for maximum revenue\n• Break-even points and margin analysis\n\n🎯 Optimization Recommendations\n• Revenue-maximizing price point\n• Profit-maximizing price point\n• Volume-maximizing price point\n• Risk-adjusted recommendations\n\n👁️ Competitor Intelligence\n• Recent pricing changes and patterns\n• Competitor pricing strategies\n• Historical price wars and outcomes\n• Predictive competitor behavior\n\n🏆 Buy Box Probability\n• Win rate at different price points\n• Required price for Buy Box dominance\n• Cost-benefit analysis of Buy Box pursuit'
  }, {
    title: 'Input Parameters',
    description: '• ASIN: Target product\n• Domain ID: Amazon marketplace (1=US, 2=UK, etc.)\n• Price Range: Min/max bounds for analysis (optional)\n• Timeframe: Historical period (default: 60 days)\n• Include Forecasting: Price predictions (default: true)\n• Competitor ASINs: Specific competitors to track (optional)'
  }, {
    title: 'Sample Prompts',
    description: '1. Basic Price Intelligence\n"Analyze pricing for ASIN B08N5WRWNW in the US market with price range $25-75"\n\n2. Competitive Price Tracking\n"Show price intelligence for ASIN B07XYZ1234 focusing on competitors B07ABC1234,B08DEF5678,B09GHI9012"\n\n3. Revenue Optimization Focus\n"What\'s the optimal price for maximizing revenue on ASIN B09ABC5678? Analyze $20-60 range with 90 days of data"\n\n4. Buy Box Strategy\n"Analyze Buy Box probability for ASIN B08DEF5678 across different price points, include forecasting"\n\n5. Quick Market Position Check\n"Where do I stand price-wise for ASIN B0CNEW1234? Check the last 30 days in the $50-150 range"\n\n6. Seasonal Price Planning\n"Run price intelligence for ASIN B07GHI9012 with 180-day history to plan seasonal pricing strategy"\n\n7. Defensive Pricing Analysis\n"Competitors are dropping prices on products similar to my ASIN B08MNO3456. Analyze optimal response in $15-40 range"\n\n8. Premium Positioning Strategy\n"Analyze price elasticity for ASIN B09PQR6789 in the $100-300 range to find optimal premium price point"'
  }, {
    title: 'Expected Output Format',
    description: 'The tool provides:\n\n💰 PRICING INTELLIGENCE\n├── Current Market Position\n├── Optimization Opportunities\n├── Competitor Analysis\n└── Strategic Recommendations\n\n📈 PRICE FORECASTING\n├── Demand Curves\n├── Optimal Price Points\n├── Revenue Projections\n└── Seasonal Adjustments'
  }, {
    title: 'Key Insights Delivered',
    description: "Market Position Analysis\n• Your price vs. market average\n• Position relative to Buy Box winner\n• Price competitiveness score\n• Market share implications\n\nOptimization Opportunities\n• Revenue Maximizer: Best price for total revenue\n• Profit Maximizer: Best price for margin optimization\n• Volume Maximizer: Best price for unit sales\n• Balanced Strategy: Optimal mix of all factors\n\nCompetitor Intelligence\n• Who's moving prices and when\n• Aggressive vs. stable competitors\n• Price war risks and opportunities\n• Competitive response predictions\n\nForecasting & Trends\n• Expected demand at different price points\n• Seasonal pricing opportunities\n• Future Buy Box probability\n• Revenue projections by price"
  }, {
    title: 'Pro Tips',
    description: "Price Range Strategy:\n• Set ranges 20-30% above and below current price\n• Wider ranges for new products\n• Narrower for established products\n\nTimeframe Selection:\n• 30-60 days for tactical decisions\n• 90-180 days for strategic planning\n• Full year for seasonal products\n\nCompetitor Tracking:\n• Monitor top 3-5 direct competitors\n• Include both premium and budget alternatives\n• Track new entrants regularly\n\nForecasting Insights:\n• Always include forecasting for forward-looking strategy\n• Pay attention to confidence intervals\n• Consider seasonal adjustments\n\nAction Triggers:\n• Set up regular monitoring (weekly/bi-weekly)\n• Act when optimal price differs >10% from current\n• Watch for sudden competitor movements\n\nIntegration with Other Tools:\n• Before: Use Quick Competitive Scan for initial assessment\n• After: Implement recommendations with Product Performance Tracker\n• Deep Dive: Combine with Deep Competitive Analysis for comprehensive strategy\n• Optimization: Follow up with Price Optimization Engine for cash flow analysis\n\nWould you like me to run a Price Intelligence analysis for any of your products? Just provide the ASIN and any specific competitors you want to track, and I'll generate a comprehensive pricing strategy report."
  }]
}, {
  id: 'mcp',
  title: 'MCP Integration',
  icon: PlugIcon,
  tags: ['Installation'],
  content: [{
    title: 'Overview',
    description: 'Model Context Protocol (MCP) allows Claude to connect to external tools and data sources, enhancing its capabilities. This guide covers installation and configuration for Claude Desktop.'
  }, {
    title: 'Prerequisites',
    description: '• Claude Desktop app (version 0.7.0 or later)\n• Administrator access to your computer\n• Basic familiarity with command line/terminal\n• Node.js installed (for npm-based servers)'
  }, {
    title: 'Installation Steps',
    description: '1. Verify Claude Desktop Version\n• Open Claude Desktop\n• Check version under Help menu\n• Update if below 0.7.0\n\n2. Locate Configuration File\n• macOS: ~/Library/Application Support/Claude/claude_desktop_config.json\n• Windows: %APPDATA%\\Claude\\claude_desktop_config.json\n• Linux: ~/.config/Claude/claude_desktop_config.json\n\n3. Configure MCP Servers\n• Create/edit configuration file\n• Add server configurations\n• Save and restart Claude Desktop\n\n4. Verify Installation\n• Look for tool icon (🔌) in input area\n• Check available MCP tools\n• Test each integration'
  }, {
    title: 'Server Configuration',
    description: 'Basic configuration structure:\n\n```json\n{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-filesystem",\n        "/path/to/allowed/directory"\n      ]\n    }\n  }\n}\n```\n\nReplace paths and API keys as needed.'
  }, {
    title: 'Troubleshooting',
    description: 'Common Issues:\n\n1. Tools not appearing\n• Verify JSON syntax\n• Ensure full restart of Claude Desktop\n• Check configuration path\n\n2. Permission errors\n• Check directory permissions\n• Run as administrator if needed\n\n3. JSON parsing errors\n• Validate syntax\n• Check for missing quotes or commas'
  }, {
    title: 'Security Best Practices',
    description: '• Limit filesystem access to necessary directories only\n• Never share configuration files containing API keys\n• Keep MCP servers updated\n• Regularly review permissions\n• Use secure API key storage'
  }]
}, {
  id: 'competitive-analysis',
  title: 'Deep Competitive Analysis',
  icon: BarChart2Icon,
  tags: ['Keepa'],
  content: [{
    title: 'Core Purpose',
    description: 'The Deep Competitive Analysis tool provides comprehensive competitive intelligence for in-depth competitor research and strategic planning. It:\n\n• Analyzes up to 5 competitors in detail with pricing, positioning, and strategy insights\n• Provides competitive positioning matrix and market share estimation\n• Delivers actionable strategic recommendations based on comprehensive data\n• Offers detailed analysis with executive summaries and deep dive options'
  }, {
    title: 'Analysis Components',
    description: '📊 Competitive Positioning Matrix\n• Visual representation of market position\n• Strengths and weaknesses mapping\n• Opportunity identification\n• Threat assessment\n\n💰 Pricing Strategy Analysis\n• Historical pricing patterns\n• Price war analysis\n• Margin comparison\n• Buy Box competition dynamics\n\n📈 Market Share Estimation\n• Relative market position\n• Share trends over time\n• Growth trajectory comparison\n• Category dominance metrics\n\n🎯 Strategic Recommendations\n• Specific action items\n• Competitive advantages to leverage\n• Vulnerabilities to address\n• Market positioning strategies'
  }, {
    title: 'Input Parameters',
    description: '• Target ASIN: Your product\n• Competitor ASINs: Up to 5 competitors\n• Domain ID: Amazon marketplace (1=US, 2=UK, etc.)\n• Timeframe: Analysis period (up to 365 days)\n• Include Historical: Price history inclusion (default: true)\n• Analysis Level: 1=summary, 2=detailed, 3=comprehensive'
  }, {
    title: 'Sample Prompts',
    description: '1. Quick Competitive Overview\n"Compare my ASIN B08N5WRWNW against competitors B07FZ8S74R,B07XQXZXJC,B08KGMQR5L in the US market"\n\n2. Top 3 Competitor Analysis\n"Run a deep competitive analysis for ASIN B07XYZ1234 against my top 3 competitors: B08ABC1234,B09DEF5678,B07GHI9012"\n\n3. New Market Entry Research\n"Analyze ASIN B09NEW1234 against established competitors B08OLD1234,B07EST2345,B09CUR3456 to plan market entry"\n\n4. Price War Assessment\n"Deep dive on pricing strategies: my ASIN B08MNO3456 vs competitors B09PQR7890,B07STU1234, focus on last 180 days"\n\n5. Full Market Leaders Analysis\n"Comprehensive analysis of ASIN B0MINE1234 against category leaders B08TOP1111,B09TOP2222,B07TOP3333,B08TOP4444,B09TOP5555"\n\n6. Feature Competition Study\n"Compare ASIN B08FEAT1234 against feature-rich competitors B09PLUS5678,B08PREM9012 with 90-day timeframe"\n\n7. Quarterly Strategy Review\n"Analyze my ASIN B07QTR1234 performance against main competitors B08Q1COMP1,B09Q1COMP2,B07Q1COMP3 for the last quarter"\n\n8. Budget vs Premium Analysis\n"Deep analysis of mid-tier ASIN B08MID1234 against budget option B07BUDG1234 and premium options B09PREM1234,B08LUX5678"'
  }, {
    title: 'Expected Output Format',
    description: '📊 EXECUTIVE SUMMARY\n├── Competitive Position\n├── Key Threats & Opportunities\n├── Price Optimization\n└── Strategic Recommendations\n\n🔍 AVAILABLE DEEP DIVES\n├── "detailed pricing analysis"\n├── "feature comparison matrix"\n├── "historical performance"\n└── "market positioning strategy"'
  }, {
    title: 'Key Deliverables',
    description: 'Executive Summary Includes:\n• Your competitive ranking (1st, 2nd, etc.)\n• Main competitive advantages\n• Critical vulnerabilities\n• Top 3 action items\n• Price optimization opportunities\n\nAvailable Deep Dives:\n• Detailed Pricing Analysis: Historical price movements, elasticity comparison, optimal pricing strategy\n• Feature Comparison Matrix: Side-by-side feature analysis, gaps and advantages, customer preference insights\n• Historical Performance: Sales rank trends, market share evolution, seasonal patterns\n• Market Positioning Strategy: Differentiation opportunities, positioning recommendations, go-to-market tactics'
  }, {
    title: 'Pro Tips',
    description: 'Competitor Selection:\n• Include direct competitors (same features/price)\n• Add one aspirational competitor (where you want to be)\n• Include one value competitor (lower price point)\n\nAnalysis Level Strategy:\n• Start with Level 1 for quick insights\n• Use Level 2 for strategic planning\n• Reserve Level 3 for major decisions\n\nTimeframe Guidelines:\n• 30-60 days for tactical adjustments\n• 90-180 days for strategic planning\n• 365 days for annual reviews\n\nFollow-Up Deep Dives:\n• "Show me the detailed pricing analysis"\n• "I need the feature comparison matrix"\n• "Give me the historical performance data"\n• "Expand on market positioning strategy"\n\nStrategic Implementation:\n• Focus on top 3 recommendations first\n• Monitor changes weekly after implementing\n• Re-run analysis monthly to track progress'
  }, {
    title: 'When to Use',
    description: '• Strategic Planning: Quarterly or annual strategy sessions\n• Major Decisions: Before significant price changes or product updates\n• Market Entry: When launching new products\n• Competitive Threats: When new competitors enter or existing ones change strategy\n• Performance Issues: When losing market share or Buy Box percentage'
  }, {
    title: 'Integration with Other Tools',
    description: '• Before: Use Quick Competitive Scan to identify which competitors to analyze\n• During: Reference findings in Price Intelligence Dashboard\n• After: Implement pricing changes with Price Optimization Engine\n• Monitor: Track results with Product Performance Tracker'
  }]
}, {
  id: 'category-scanner',
  title: 'Category Market Scanner',
  icon: BarChart2Icon,
  tags: ['Keepa'],
  content: [{
    title: 'Core Purpose',
    description: 'The Category Market Scanner provides comprehensive category analysis to identify opportunities, trends, and market dynamics using intelligent data sampling strategies. It:\n\n• Analyzes entire Amazon product categories efficiently\n• Identifies market opportunities and gaps within categories\n• Uses stratified sampling to capture representative market data\n• Provides actionable insights for market entry or expansion'
  }, {
    title: 'Smart Sampling Strategy',
    description: '📈 Performance Tiers\n• Top 20%: Market leaders and best sellers\n• Mid 60%: Core market products\n• Bottom 20%: Struggling or niche products\n\n🎯 Additional Sampling Factors\n• Even distribution across price ranges\n• Multiple brands per segment\n• Recently updated products prioritized\n• Representative mix of product ages'
  }, {
    title: 'Key Analysis Features',
    description: '📊 Market Overview\n• Total market size estimation\n• Average prices and price distribution\n• Sales velocity indicators\n• Category growth trends\n\n🏢 Competitive Landscape\n• Number of active sellers\n• Brand concentration analysis\n• Market saturation levels\n• Entry barrier assessment\n\n💡 Opportunity Identification\n• Underserved price points\n• Gaps in product features\n• Emerging subcategories\n• Low-competition niches\n\n📈 Performance Benchmarks\n• Top performer characteristics\n• Success factors analysis\n• Average performance metrics\n• Category-specific KPIs'
  }, {
    title: 'Input Parameters',
    description: '• Category ID: Amazon category node ID (required)\n• Domain ID: Amazon marketplace (required)\n• Price Range: "min,max" filter (optional)\n• Sample Size: Products to analyze (default: 200, max: 500)\n• Include Rankings: Sales rank analysis (default: true)\n• Analysis Depth: "light", "standard", or "deep"'
  }, {
    title: 'Sample Prompts',
    description: '1. Basic Category Overview\n"Scan the Electronics category (16318031) in the US market with standard analysis"\n\n2. Price-Focused Analysis\n"Analyze Kitchen & Dining (284507) products between $20-100 to find opportunities"\n\n3. Deep Market Research\n"Run a deep analysis of Pet Supplies (2619533) with 300 product sample size"\n\n4. Quick Opportunity Scan\n"Light scan of Home Improvement (228013) to identify quick wins"\n\n5. Premium Market Analysis\n"Scan Beauty & Personal Care (3760911) for products over $50, sample size 400"\n\n6. Competitive Landscape Study\n"Analyze Sports & Outdoors (3375251) category with focus on brand distribution"\n\n7. New Seller Entry Research\n"Scan Toys & Games (165793) with $10-50 range to find entry opportunities"\n\n8. Multi-Category Comparison\n"Analyze Office Products (1064954) with standard depth, 250 product sample"\n\n9. Seasonal Category Analysis\n"Deep scan of Garden & Outdoor (2972638) to understand seasonal patterns"\n\n10. Niche Discovery\n"Scan Baby Products (165796) looking for underserved niches under $30"'
  }, {
    title: 'Expected Output Format',
    description: '📊 MARKET OVERVIEW\n├── Category Size: $XXM monthly\n├── Active Products: X,XXX\n├── Avg Price: $XX.XX\n└── Growth Trend: ↗️ +X%\n\n💰 PRICE ANALYSIS\n├── Price Distribution\n├── Sweet Spots\n├── Gap Opportunities\n└── Premium vs Budget Split\n\n🏆 TOP PERFORMERS\n├── Common Success Factors\n├── Price/Feature Patterns\n├── Brand Strategies\n└── Key Differentiators\n\n🎯 OPPORTUNITIES\n├── Underserved Segments\n├── Price Point Gaps\n├── Feature Opportunities\n└── Entry Recommendations'
  }, {
    title: 'Key Insights',
    description: "Market Dynamics\n• Is the category growing or shrinking?\n• What's the competitive intensity?\n• Are there seasonal patterns?\n• What's the typical product lifecycle?\n\nPrice Intelligence\n• Optimal price points for entry\n• Price elasticity indicators\n• Premium vs value market split\n• Price gap opportunities\n\nCompetitive Factors\n• Brand concentration levels\n• Private label penetration\n• Amazon's presence in category\n• International seller percentage\n\nEntry Strategies\n• Best price points for new entrants\n• Required features for success\n• Investment requirements\n• Expected time to profitability"
  }, {
    title: 'Pro Tips',
    description: 'Category ID Finding:\n• Use "0" to get all root categories first\n• Browse Amazon\'s category tree for specific IDs\n• Start broad, then narrow down\n\nSample Size Strategy:\n• 100-200 for quick scans\n• 300-400 for strategic decisions\n• 500 for comprehensive analysis\n\nPrice Range Usage:\n• Leave empty for full market view\n• Set ranges to focus on your target segment\n• Use multiple scans with different ranges\n\nAnalysis Depth Guide:\n• Light: Quick market assessment (< 100 products)\n• Standard: Balanced analysis (200 products)\n• Deep: Comprehensive research (300+ products)\n\nStrategic Applications:\n• Run quarterly for market monitoring\n• Use before product launches\n• Compare multiple categories for diversification\n• Track category changes over time'
  }, {
    title: 'When to Use',
    description: '• Market Entry: Before launching in a new category\n• Portfolio Expansion: Finding adjacent opportunities\n• Competitive Intelligence: Understanding market dynamics\n• Investment Decisions: Evaluating category potential\n• Trend Identification: Spotting emerging opportunities'
  }, {
    title: 'Integration with Other Tools',
    description: '• After Scanning: Use Market Opportunity Hunter for specific gaps\n• Product Selection: Follow with Quick Competitive Scan on interesting products\n• Deep Dive: Use Deep Competitive Analysis on top performers\n• Pricing Strategy: Apply Price Intelligence Dashboard to opportunities found\n• Launch Planning: Use Price Optimization Engine for identified products'
  }, {
    title: 'Common Categories',
    description: 'Popular categories to scan:\n\n• Electronics: 16318031\n• Home & Kitchen: 1063498\n• Sports & Outdoors: 3375251\n• Beauty & Personal Care: 3760911\n• Pet Supplies: 2619533\n• Toys & Games: 165793\n• Office Products: 1064954\n• Tools & Home Improvement: 228013'
  }]
}, {
  id: 'quick-competitive-scan',
  title: 'Quick Competitive Scan',
  icon: BarChart2Icon,
  tags: ['Keepa'],
  content: [{
    title: 'Core Purpose',
    description: 'The Quick Competitive Scan is a lightweight tool designed for fast competitive intelligence. It:\n\n• Provides rapid competitive analysis for up to 10 products\n• Delivers essential metrics without overwhelming detail\n• Perfect for daily competitor monitoring\n• Enables quick decision-making with actionable insights'
  }, {
    title: 'Key Features',
    description: '📊 Essential Metrics\n• Current prices and rankings\n• 30-day price changes\n• Buy Box ownership status\n• Sales rank movements\n• Review counts and ratings\n• Offer counts (optional)\n\n🎯 Compact Analysis\n• Side-by-side comparison table\n• Trend indicators for quick insights\n• Relative performance scoring\n• Quick recommendations\n\n⚡ Speed & Efficiency\n• Results in seconds\n• Streamlined data presentation\n• Focus on actionable metrics\n• Minimal complexity'
  }, {
    title: 'Input Parameters',
    description: '• ASINs: Comma-separated list (max 10)\n• Domain ID: Amazon marketplace (1=US, 2=UK, etc.)\n• Include Offers: Live offer counts (default: false)\n• Timeframe: Analysis period in days (max 90, default: 30)'
  }, {
    title: 'Sample Prompts',
    description: '1. Daily Competitor Check\n"Quick scan of B08N5WRWNW,B07FZ8S74R,B07XQXZXJC in the US market"\n\n2. Price Movement Analysis\n"Compare prices for B09ABC1234,B08DEF5678,B07GHI9012 over the last 30 days"\n\n3. Market Position Check\n"Scan my product B08MNO3456 against top 3 competitors B09PQR7890,B07STU1234,B08VWX4567"\n\n4. Buy Box Competition\n"Quick competitive scan with offer counts for B07XXX1111,B08YYY2222,B09ZZZ3333"\n\n5. Category Leaders Comparison\n"Fast scan of top 5 products: B08TOP1,B09TOP2,B07TOP3,B08TOP4,B09TOP5"'
  }, {
    title: 'Expected Output Format',
    description: '📊 COMPETITIVE SNAPSHOT\n┌─────────┬────────┬─────────┬──────────┬─────────┐\n│ ASIN │ Price │ Rank │ Buy Box │ Trend │\n├─────────┼────────┼─────────┼──────────┼─────────┤\n│ B08XXX │ $29.99 │ #1,234 │ ✓ Yes │ ↗️ +15% │\n│ B09YYY │ $24.99 │ #2,345 │ ✗ No │ ↘️ -5% │\n│ B07ZZZ │ $34.99 │ #987 │ ✓ Yes │ → Stable│\n└─────────┴────────┴─────────┴──────────┴─────────┘\n\n🎯 QUICK INSIGHTS\n├── Price Leader: B09YYY at $24.99\n├── Performance Leader: B07ZZZ (#987)\n├── Trending Up: B08XXX (+15%)\n└── Action: Consider price adjustment\n\n⚡ RECOMMENDATIONS\n├── Immediate: [Quick action items]\n├── Monitor: [What to watch]\n└── Investigate: [Needs deeper analysis]'
  }, {
    title: 'Key Metrics',
    description: '💰 Price Tracking\n• Current selling price\n• 30-day price change percentage\n• Price stability indicator\n• Min/max price in period\n\n📈 Rank Performance\n• Current sales rank\n• Rank trend direction\n• Category positioning\n• Velocity indicators\n\n🏆 Buy Box Status\n• Current ownership\n• Win rate if available\n• Competitive advantage\n• Price competitiveness\n\n🎯 Quick Recommendations\n• Price optimization opportunities\n• Competitive threats\n• Market positioning\n• Action priorities'
  }, {
    title: 'Pro Tips',
    description: 'Daily Monitoring Routine:\n• Run every morning for key competitors\n• Set up a tracking spreadsheet\n• Look for sudden changes\n• Act on opportunities quickly\n\nASIN Selection:\n• Include your top 3-5 direct competitors\n• Add the category leader\n• Include one budget alternative\n• Monitor new entrants\n\nTimeframe Strategy:\n• 7 days for volatile markets\n• 30 days for standard monitoring\n• 60-90 days for stable categories\n\nAction Triggers:\n• Price drops > 10%\n• Rank improvements > 50%\n• New Buy Box winners\n• Sudden offer count changes'
  }, {
    title: 'When to Use',
    description: '📅 Daily Operations\n• Morning competitive check\n• Pre-pricing decisions\n• Buy Box monitoring\n• Performance tracking\n\n🎯 Tactical Decisions\n• Before price changes\n• Inventory planning\n• Promotion timing\n• Response to competition\n\n🔍 Initial Research\n• First look at competitors\n• Market entry assessment\n• Category exploration\n• Quick benchmarking'
  }, {
    title: 'Integration with Other Tools',
    description: '🚀 As a Starting Point:\n• Use results to identify competitors for Deep Competitive Analysis\n• Spot pricing anomalies for Price Intelligence Dashboard\n• Find opportunities for Market Opportunity Hunter\n\n✅ For Validation:\n• Confirm findings from other analyses\n• Quick check after implementing changes\n• Verify competitor movements\n• Monitor strategy effectiveness\n\n📅 Regular Workflow:\n• Daily: Quick Competitive Scan\n• Weekly: Price Intelligence Dashboard\n• Monthly: Product Performance Tracker\n• Quarterly: Deep Competitive Analysis'
  }, {
    title: 'Common Use Cases',
    description: '1. Daily Monitoring\n• Check top 5 competitors every morning\n• Look for price changes or Buy Box shifts\n• Adjust strategy if needed\n\n2. Pre-Launch Research\n• Scan similar products in your category\n• Identify pricing sweet spots\n• Understand competitive landscape\n\n3. Performance Issues\n• Quick scan when sales drop\n• Identify if competitors changed strategy\n• Determine response needed\n\n4. Portfolio Management\n• Scan all your products weekly\n• Compare performance across portfolio\n• Identify which need attention'
  }]
}, {
  id: 'dashboard-visualization',
  title: 'Dashboard Visualization Tips',
  icon: BarChart2Icon,
  tags: ['Tips'],
  content: [{
    title: 'Price Optimization Engine Dashboards',
    description: '📊 Cash Flow Maximization Dashboard\n\n"Cash Flow Maximization Dashboard"\nRun Price Optimization for ASIN B08N5WRWNW (cost $12.50) then create an interactive dashboard showing:\n• KPI cards for current vs optimal price with projected monthly gain\n• Bar chart of cash flow by price band\n• Line chart showing sales volume vs price relationship\n• Margin calculator slider to see profit at different prices\n• Implementation timeline with progress tracker\n\n"Price Band Performance Visualizer"\nAfter analyzing ASIN B07XYZ1234 (cost $15), create a dashboard with:\n• Heat map of price bands colored by profitability\n• Dual-axis chart showing units sold vs cash flow by price\n• Interactive price simulator showing real-time margin/volume\n• Gauge charts for current vs optimal performance'
  }, {
    title: 'Market Opportunity Hunter Dashboards',
    description: '🎯 Opportunity Discovery Dashboard\n\n"Opportunity Discovery Dashboard"\nRun Market Opportunity Hunter for Electronics under $100, then visualize:\n• Bubble chart plotting market size vs competition\n• Treemap of opportunity categories sized by revenue potential\n• KPI cards showing top 3 opportunities with entry scores\n• Interactive filters for competition level and investment required\n\n"Market Gap Analyzer"\nFind opportunities in Home & Kitchen, then create a dashboard with:\n• Scatter plot of price gaps vs demand volume\n• Radar chart comparing opportunity dimensions\n• Timeline showing seasonal opportunity windows\n• Sortable opportunity table with quick-launch metrics'
  }, {
    title: 'Product Performance Tracker Dashboards',
    description: '📈 Performance Monitoring Dashboard\n\n"Performance Monitoring Dashboard"\nTrack performance for ASIN B09ABC5678, then create a dashboard showing:\n• Performance score gauge (0-100) with trend indicator\n• Multi-line chart comparing your metrics vs category average\n• Alert panel for performance warnings\n• 30/60/90 day trend sparklines for all KPIs\n• Competitive position radar chart\n\n"Product Health Monitor"\nAnalyze ASIN B08DEF5678 performance and visualize:\n• Health status cards with color-coded indicators\n• Stacked area chart showing rank changes over time\n• Review velocity and rating trend combination chart\n• Percentile ranking bar within category'
  }, {
    title: 'Price Intelligence Dashboards',
    description: '💰 Dynamic Pricing Command Center\n\n"Dynamic Pricing Command Center"\nRun Price Intelligence for ASIN B08N5WRWNW, then create:\n• Real-time price position slider showing your price vs competitors\n• Buy Box probability gauge at different price points\n• Demand curve visualization with optimal price marker\n• Competitor price movement timeline\n• Revenue projection calculator with interactive price input\n\n"Competitive Pricing Tracker"\nAnalyze pricing for ASIN B07GHI9012 and build a dashboard with:\n• Price war alert system with visual notifications\n• Historical price chart with competitor overlays\n• Price elasticity curve with sweet spot highlighting\n• Market share pie chart at different price points'
  }, {
    title: 'Deep Competitive Analysis Dashboards',
    description: '🔍 Competitive Intelligence Hub\n\n"Competitive Intelligence Hub"\nCompare ASIN B08MINE123 against 4 competitors, then visualize:\n• Competitive positioning matrix (price vs performance)\n• Spider/radar chart comparing features and metrics\n• Market share donut chart with drill-down capability\n• Timeline showing competitive moves and responses\n• SWOT analysis interactive grid\n\n"Strategic Planning Dashboard"\nRun deep analysis on 5 ASINs and create:\n• Head-to-head comparison cards with win/loss indicators\n• Parallel coordinates chart for multi-metric comparison\n• Strategy recommendation panels with action buttons\n• Historical performance race chart animation'
  }, {
    title: 'Category Market Scanner Dashboards',
    description: '📂 Category Landscape Visualizer\n\n"Category Landscape Visualizer"\nScan Electronics category, then create a dashboard showing:\n• Market size treemap with subcategory breakdown\n• Price distribution histogram with opportunity zones\n• Brand concentration pie chart with market share\n• Entry barrier matrix (investment vs difficulty)\n• Top performers carousel with key success factors\n\n"Market Intelligence Dashboard"\nAnalyze Kitchen category and build:\n• 3D scatter plot of products (price, rank, reviews)\n• Category growth trend with forecast projection\n• Competitive density heatmap by price range\n• Opportunity scoring matrix with filters'
  }, {
    title: 'Quick Competitive Scan Dashboards',
    description: '⚡ Daily Competition Monitor\n\n"Daily Competition Monitor"\nQuick scan 8 competitor ASINs, then create:\n• Competitive dashboard with traffic light status indicators\n• Grouped bar chart comparing key metrics\n• Price change alerts with percentage badges\n• Buy Box ownership timeline\n• Quick action buttons for deeper analysis\n\n"Fast Market Snapshot"\nScan top 10 products in my niche and visualize:\n• Leaderboard table with trend arrows\n• Mini sparklines for each competitor\'s metrics\n• Position changes waterfall chart\n• Alert feed for significant changes'
  }, {
    title: 'Universal Dashboard Features',
    description: '🎨 Common Enhancement Requests:\n\n• "Add dark mode toggle with smooth transition"\n• "Include export buttons for all charts"\n• "Make it mobile-responsive with touch gestures"\n• "Add loading animations while fetching data"\n• "Include a refresh button with timestamp"\n• "Create fullscreen mode for presentations"'
  }, {
    title: 'Combination Dashboards',
    description: '💡 Executive Strategy Dashboard\n\n"Executive Strategy Dashboard"\nRun Price Optimization, Performance Tracker, and Competitive Scan for top 3 products, then create:\n• Portfolio overview with total metrics\n• Product performance comparison matrix\n• Price optimization opportunities carousel\n• Competitive threat assessment panel\n• Strategic recommendations with priority scoring\n\n"Market Entry Dashboard"\nUse Market Opportunity Hunter and Category Scanner for Home Goods under $50, then visualize:\n• Opportunity heat map with ROI projections\n• Competitive landscape 3D visualization\n• Entry strategy timeline with milestones\n• Investment calculator with break-even analysis'
  }, {
    title: 'Pro Tips',
    description: "🚀 Best Practices for Tool-Specific Dashboards:\n\n1. Always run the tool first, then request the dashboard based on the data\n2. Mention specific metrics from the tool's output you want visualized\n3. Request interactivity that makes sense for the data type\n4. Consider the decision-making context when designing the layout\n5. Ask for progressive disclosure - summary view with drill-down options"
  }]
}];
export function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<(typeof sections)[0] | null>(null);
  const filteredSections = sections.filter(section => section.title.toLowerCase().includes(searchQuery.toLowerCase()) || section.content.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) || section.tags && section.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
  return <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
          <p className="text-gray-600 mt-1">
            Learn how to use Personabl and get the most out of your Amazon
            business
          </p>
        </div>
        <div className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search documentation..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map(section => {
          const Icon = section.icon;
          return <button key={section.id} onClick={() => setSelectedSection(section)} className="bg-white p-6 rounded-xl border border-gray-200 text-left transition-all duration-200 hover:shadow-lg hover:border-indigo-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-sm">
                    {section.content.length} articles
                  </p>
                  {section.tags && section.tags.length > 0 && <div className="flex gap-2">
                      {section.tags.map(tag => <span key={tag} className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                          {tag}
                        </span>)}
                    </div>}
                </div>
              </button>;
        })}
        </div>
        <Modal isOpen={selectedSection !== null} onClose={() => setSelectedSection(null)}>
          {selectedSection && <div className="overflow-y-auto max-h-[70vh]">
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <button onClick={() => setSelectedSection(null)} className="hover:text-gray-900">
                  Documentation
                </button>
                <ChevronRightIcon className="w-4 h-4" />
                <span className="text-gray-900">{selectedSection.title}</span>
              </nav>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <selectedSection.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSection.title}
                </h2>
              </div>
              {selectedSection.tags && selectedSection.tags.length > 0 && <div className="flex gap-2 mb-6">
                  {selectedSection.tags.map(tag => <span key={tag} className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                      {tag}
                    </span>)}
                </div>}
              <div className="space-y-6">
                {selectedSection.content.map((item, index) => <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {item.description.includes('```') ? <>
                          {item.description.split('```').map((part, i) => {
                    if (i % 2 === 1) {
                      // This is a code block
                      const [lang, ...code] = part.split('\n');
                      return <pre key={i} className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                                  <code className="text-sm font-mono text-gray-800">
                                    {code.join('\n')}
                                  </code>
                                </pre>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                        </> : item.description}
                    </p>
                  </div>)}
              </div>
            </div>}
        </Modal>
      </div>
    </DashboardLayout>;
}