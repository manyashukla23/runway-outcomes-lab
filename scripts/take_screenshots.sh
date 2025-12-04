#!/bin/bash

# Script to help take screenshots for documentation
# Make sure your app is running on http://localhost:3001

echo "📸 Screenshot Helper for Documentation"
echo ""
echo "This script will help you take screenshots of your app."
echo ""
echo "Prerequisites:"
echo "1. Make sure your app is running on http://localhost:3001"
echo "2. Have your browser open to the dashboard"
echo ""
echo "Screenshots needed:"
echo "1. dashboard-overview.png - Full dashboard page"
echo "2. dashboard-metrics.png - Close-up of the 4 metric cards"
echo "3. simulator-overview.png - Full simulator page"
echo "4. simulator-form.png - Product details form"
echo "5. simulator-results.png - Prediction results card"
echo ""
echo "Taking screenshots..."
echo ""

# Create output directory
mkdir -p ../docs/images

echo "Please take screenshots manually:"
echo ""
echo "1. Open http://localhost:3001/dashboard in your browser"
echo "2. Take a full-page screenshot and save as: docs/images/dashboard-overview.png"
echo "3. Zoom in on the metric cards and save as: docs/images/dashboard-metrics.png"
echo "4. Navigate to http://localhost:3001/simulator"
echo "5. Take a full-page screenshot and save as: docs/images/simulator-overview.png"
echo "6. Take a screenshot of just the form and save as: docs/images/simulator-form.png"
echo "7. Submit the form, then screenshot the results and save as: docs/images/simulator-results.png"
echo ""
echo "On macOS, you can use:"
echo "  - Cmd+Shift+4 for area selection"
echo "  - Cmd+Shift+3 for full screen"
echo "  - Or use the Screenshot app (Cmd+Shift+5)"
echo ""
echo "After saving all screenshots, run:"
echo "  git add docs/images/*.png"
echo "  git commit -m 'Add documentation screenshots'"
echo "  git push"

