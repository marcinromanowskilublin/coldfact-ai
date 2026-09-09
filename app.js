const portfolio = {
  domain: {
    index: "01",
    kicker: "TRANSFERABLE NAME",
    title: "coldfact.ai + product language",
    description:
      "Short .ai domain and a locked public promise: sixty seconds of speech, three scores, one shareable card. Speech sample, not person.",
    bullets: [
      "Registrar transfer of coldfact.ai after escrow",
      "FACT / FORCE / FOG naming and claim boundary",
      "Brand frames for intake, scores, and report",
    ],
    bestFor: "Speech analytics, coaching, media, creator tools",
    status: "Domain live at registrar · listing not yet public HTTPS",
  },
  demo: {
    index: "02",
    kicker: "PUBLIC TEASER",
    title: "Static sales demo",
    description:
      "This page: for-sale framing, asking price, and a composed FACT / FORCE / FOG walkthrough. No microphone, no upload, no APIs.",
    bullets: [
      "Static HTML / CSS / JS ready for ordinary hosting",
      "Concept screens: intake, scores, card",
      "Claim boundary written into the page",
    ],
    bestFor: "Showing a buyer the product in under a minute",
    status: "Local / FTP-ready · contact withheld until you publish it",
  },
  core: {
    index: "03",
    kicker: "PRIMARY PROTOTYPE",
    title: "FastAPI speech-sample prototype",
    description:
      "Cleaned source for audio intake, preview, optional provider hooks, and a result card. Keys stripped. Unvalidated. Not sold as a finished SaaS.",
    bullets: [
      "FastAPI + SPA, Docker and deploy notes",
      "Public copy aligned to FACT / FORCE / FOG",
      "Checkout scaffold exists — not required to buy the package",
    ],
    bestFor: "A product team that will finish the engine",
    status: "Keys stripped · no user recordings · no production warranty",
  },
};

const mockScenarios = {
  handoff: {
    input:
      "“The delivery team needs the decision owner, open questions, and next milestone captured before Friday.”",
    title: "More force than fact",
    results: [
      "FACT: owner, questions, Friday — three concrete nouns",
      "FORCE: ‘needs’ + deadline pressure",
      "FOG: ‘the delivery team’ stays unnamed",
    ],
    meters: [
      ["FACT", 64],
      ["FORCE", 81],
      ["FOG", 47],
    ],
  },
  customer: {
    input:
      "“The customer needs a concise follow-up with the requested integration details and a defined owner for the next call.”",
    title: "Clear next step, thin evidence",
    results: [
      "FACT: follow-up, integration details, owner, next call",
      "FORCE: ‘needs’ frames the ask as settled",
      "FOG: which customer, which integration — not in the sample",
    ],
    meters: [
      ["FACT", 71],
      ["FORCE", 69],
      ["FOG", 52],
    ],
  },
  review: {
    input:
      "“The review group needs the evidence source, the unresolved statement, and the approval decision separated before publication.”",
    title: "High fact, leftover fog",
    results: [
      "FACT: source, unresolved statement, approval, publication",
      "FORCE: ‘needs’ + ‘before publication’",
      "FOG: who decides, and on what evidence, stay off-sample",
    ],
    meters: [
      ["FACT", 78],
      ["FORCE", 58],
      ["FOG", 44],
    ],
  },
};

const assetPanel = document.getElementById("assetPanel");
const assetTabs = [...document.querySelectorAll(".asset-tab")];
const scenarioSelect = document.getElementById("mockScenario");
const runMockButton = document.getElementById("runMock");
const mockTranscript = document.getElementById("mockTranscript");
const mockLog = document.getElementById("mockLog");
const mockResult = document.getElementById("mockResult");
const mockResultTitle = document.getElementById("mockResultTitle");
const mockResultItems = document.getElementById("mockResultItems");
const mockState = document.getElementById("mockState");
const mockProgress = document.getElementById("mockProgress");
const demoMeters = document.getElementById("demoMeters");
const demoPhones = [...document.querySelectorAll(".demo-phone")];
const demoSteps = [...document.querySelectorAll("#demoSteps li")];
const copyContactButton = document.getElementById("copyContact");
const copyStatus = document.getElementById("copyStatus");

function renderAsset(assetKey) {
  const item = portfolio[assetKey];
  if (!item || !assetPanel) return;

  assetPanel.innerHTML = `
    <div class="asset-index">${item.index}</div>
    <div class="asset-content">
      <p class="asset-kicker">${item.kicker}</p>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <ul class="asset-list">
        ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
    </div>
    <div class="asset-meta">
      <span>BEST FOR</span>
      <strong>${item.bestFor}</strong>
      <span>STATUS</span>
      <strong>${item.status}</strong>
    </div>
  `;
}

assetTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const assetKey = tab.dataset.asset;
    assetTabs.forEach((button) => {
      const isCurrent = button === tab;
      button.classList.toggle("is-active", isCurrent);
      button.setAttribute("aria-selected", String(isCurrent));
    });
    renderAsset(assetKey);
  });
});

function setStage(stageName) {
  demoPhones.forEach((phone) => {
    phone.classList.toggle("is-active", phone.dataset.stage === stageName);
  });
  demoSteps.forEach((step) => {
    step.classList.toggle("is-current", step.dataset.step === stageName);
  });
}

function renderMeters(meters) {
  if (!demoMeters || !meters) return;
  demoMeters.innerHTML = meters
    .map(
      ([label, value]) => `
      <div>
        <span>${label}</span>
        <i style="--v:${value}%"><b></b></i>
        <em>${value}</em>
      </div>`,
    )
    .join("");
  demoMeters.hidden = false;
}

function setScenario() {
  const scenario = mockScenarios[scenarioSelect.value];
  if (!scenario) return;

  mockTranscript.textContent = scenario.input;
  mockResult.hidden = true;
  if (demoMeters) demoMeters.hidden = true;
  mockState.textContent = "STANDBY";
  setStage("intake");
  mockLog.innerHTML = `
    <p><span>00</span> Sample loaded: ${scenarioSelect.options[scenarioSelect.selectedIndex].text}.</p>
    <p><span>—</span> Concept UI only — scores describe the sample, not a person.</p>
  `;
  mockProgress.style.width = "0%";
}

scenarioSelect.addEventListener("change", setScenario);

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function runMockPipeline() {
  const scenario = mockScenarios[scenarioSelect.value];
  if (!scenario || runMockButton.disabled) return;

  const stages = [
    { key: "intake", label: "Locking fictional speech sample", width: 28 },
    { key: "scores", label: "Reading FACT / FORCE / FOG on the sample", width: 64 },
    { key: "report", label: "Composing the share card", width: 100 },
  ];

  runMockButton.disabled = true;
  runMockButton.innerHTML = 'Running <span aria-hidden="true">…</span>';
  mockResult.hidden = true;
  if (demoMeters) demoMeters.hidden = true;
  mockLog.innerHTML = "";
  mockState.textContent = "RUNNING";
  mockProgress.style.width = "0%";

  for (let index = 0; index < stages.length; index += 1) {
    const stage = stages[index];
    setStage(stage.key);
    await wait(620);
    mockLog.insertAdjacentHTML(
      "beforeend",
      `<p><span>0${index + 1}</span> ${stage.label}</p>`,
    );
    mockProgress.style.width = `${stage.width}%`;
    if (stage.key === "scores") {
      renderMeters(scenario.meters);
    }
  }

  await wait(380);
  mockResultTitle.textContent = scenario.title;
  mockResultItems.innerHTML = scenario.results.map((item) => `<li>${item}</li>`).join("");
  mockResult.hidden = false;
  mockState.textContent = "COMPLETE";
  runMockButton.disabled = false;
  runMockButton.innerHTML = 'Run demo <span aria-hidden="true">→</span>';
}

runMockButton.addEventListener("click", runMockPipeline);

function copyContact() {
  const email = (copyContactButton.dataset.email || "").trim();
  if (!email || email === "CONTACT_EMAIL_HERE") {
    copyStatus.textContent = "Contact is not published on this page. Fill it in before you go live.";
  } else {
    navigator.clipboard.writeText(email).then(
      () => {
        copyStatus.textContent = "Contact e-mail copied.";
      },
      () => {
        copyStatus.textContent = `Contact: ${email}`;
      },
    );
  }

  window.setTimeout(() => {
    copyStatus.textContent = "";
  }, 4200);
}

copyContactButton.addEventListener("click", copyContact);
document.getElementById("year").textContent = String(new Date().getFullYear());
setStage("intake");
