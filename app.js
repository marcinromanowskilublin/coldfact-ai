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
    <p><span>—</span> Preview only — scores describe the sample, not a person.</p>
  `;
  mockProgress.style.width = "0%";
}

if (scenarioSelect) scenarioSelect.addEventListener("change", setScenario);

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function runMockPipeline() {
  const scenario = mockScenarios[scenarioSelect.value];
  if (!scenario || runMockButton.disabled) return;

  const stages = [
    { key: "intake", label: "Locking fictional speech sample", width: 28 },
    { key: "scores", label: "Reading FACT / FORCE / FOG on the sample", width: 64 },
    { key: "report", label: "Printing the receipt", width: 100 },
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

if (runMockButton) runMockButton.addEventListener("click", runMockPipeline);

// mobile nav

const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    mobileNav.hidden = !isOpen;
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      mobileNav.hidden = true;
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// early access form

const earlyForm = document.getElementById("earlyForm");
const earlyStatus = document.getElementById("earlyStatus");

if (earlyForm && earlyStatus) {
  earlyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("earlyEmail").value.trim();
    if (!email) return;

    const subject = encodeURIComponent("ColdFact early access");
    const body = encodeURIComponent(`Add me to the ColdFact early access list: ${email}`);
    window.location.href = `mailto:hello@coldfact.ai?subject=${subject}&body=${body}`;

    earlyStatus.textContent = "Opening your mail app — send it to lock in your spot.";
    earlyForm.reset();
    window.setTimeout(() => {
      earlyStatus.textContent = "";
    }, 5200);
  });
}

// scroll reveal

const revealTargets = [...document.querySelectorAll("[data-reveal]")];

if (revealTargets.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

document.getElementById("year").textContent = String(new Date().getFullYear());
setStage("intake");
