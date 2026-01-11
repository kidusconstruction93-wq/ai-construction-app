let inspectionData = JSON.parse(localStorage.getItem("inspectionData")) || [];

async function sendToAI() {
    let site = document.getElementById("siteName").value;
    let date = document.getElementById("reportDate").value;

    let alignment = document.getElementById("formworkAlignment").value;
    let clean = document.getElementById("formworkClean").value;
    let bracing = document.getElementById("formworkBracing").value;

    let rebarSize = document.getElementById("rebarSize").value;
    let rebarSpacing = document.getElementById("rebarSpacing").value;
    let rebarClean = document.getElementById("rebarClean").value;

    let slump = document.getElementById("concreteSlump").value;
    let curing = document.getElementById("concreteCuring").value;

    let prompt = `
You are a construction QA/QC inspector.
Site: ${site}
Date: ${date}

Formwork:
- Alignment: ${alignment} mm
- Cleanliness: ${clean}
- Bracing: ${bracing}

Reinforcement:
- Bar size: ${rebarSize} mm
- Spacing: ${rebarSpacing} mm
- Cleanliness: ${rebarClean}

Concrete:
- Slump: ${slump} mm
- Curing: ${curing}

Check compliance with Eurocode standards, identify issues, and suggest remarks or corrective actions. Return in table format with columns: Item, Issue, Recommended Action.
`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{role: "user", content: prompt}],
                temperature: 0
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;
        document.getElementById("aiOutput").value = aiText;

        inspectionData.push({site, date, aiText});
        localStorage.setItem("inspectionData", JSON.stringify(inspectionData));

    } catch (err) {
        console.error(err);
        alert("Error connecting to AI. Check your API key and internet.");
    }
}
