const allSteamChallenges = [
  {
    id: "s1",
    username: "SteamSupportNotice",
    avatar: "SN",
    avatarStyle: "pfp-operator",
    avatarImage: "images/profile-pictures/s01_nitro_like_reward_user.png",
    time: "Today at 14:10",
    source: "Steam Chat",
    message: "Your Steam account has been reported for suspicious activity. Review the security case here: https://steamcommunity.com.security-review.account-check.ex/support/ticket/ST-48291",
    correctIsPhishing: true,
    explanation: "Phishing: fake account warnings and urgent verification links are common Steam scams."
  },
  {
    id: "s2",
    username: "ArbenCS2",
    avatar: "AR",
    avatarStyle: "pfp-neon",
    avatarImage: "images/profile-pictures/s02_friend_arben.png",
    time: "Today at 12:20",
    source: "Friends Chat",
    message: "Want to play Counter-Strike later tonight? I made a warmup lobby in FACEIT: https://www.faceit.com/",
    correctIsPhishing: false,
    explanation: "Safe: this is a normal message from a friend. The link goes to the official FACEIT domain and does not ask for Steam Guard codes or private details."
  },
  {
    id: "s3",
    username: "SkinsVault.gg",
    avatar: "SV",
    avatarStyle: "pfp-gold",
    avatarImage: "images/profile-pictures/s03_free_skins_bot.png",
    time: "Yesterday at 19:45",
    source: "Steam Chat",
    message: "You won rare CS2 skins from this week's community drop. Claim before expiry: https://steamcommunity.com.rewards-cs2.item-drop.test/cs2/claim?drop=rare",
    correctIsPhishing: true,
    explanation: "Phishing: free skins and urgent claim links are common tricks used to steal Steam accounts."
  },
  {
    id: "s4",
    username: "BalkanScrimHub",
    avatar: "BH",
    avatarStyle: "pfp-green",
    avatarImage: "images/profile-pictures/s04_group_admin.png",
    time: "Today at 09:05",
    source: "Group Announcement",
    message: "Tournament starts at 18:00. Bracket is posted here: https://challonge.com/",
    correctIsPhishing: false,
    explanation: "Safe: this is a normal tournament reminder using a recognizable bracket website and it does not request account credentials."
  },
  {
    id: "s5",
    username: "GuardCheck_Official",
    avatar: "GC",
    avatarStyle: "pfp-steel",
    avatarImage: "images/profile-pictures/s05_guard_code_scammer.png",
    time: "Today at 16:22",
    source: "Steam Chat",
    message: "Send your Steam Guard code to confirm this account belongs to you.",
    correctIsPhishing: true,
    explanation: "Phishing: never share Steam Guard codes. Real support will not ask for them in chat."
  },
  {
    id: "s6",
    username: "NoraPlays",
    avatar: "NP",
    avatarStyle: "pfp-violet",
    avatarImage: "images/profile-pictures/s06_nora.png",
    time: "Yesterday at 21:11",
    source: "Friends Chat",
    message: "I saw the game you recommended. It is on sale this week on the official Steam store: https://store.steampowered.com/",
    correctIsPhishing: false,
    explanation: "Safe: the link points to the official Steam store domain and the message does not ask for sensitive information."
  },
  {
    id: "s7",
    username: "TradeBot-Delta",
    avatar: "TD",
    avatarStyle: "pfp-ember",
    avatarImage: "images/profile-pictures/s07_trade_offer.png",
    time: "Today at 13:33",
    source: "Trade Message",
    message: "You received a trade offer worth EUR200. Confirm the pending offer here: https://steamcommunity.com.trade-offer-confirm.tdo/tradeoffer/884219/confirm",
    correctIsPhishing: true,
    explanation: "Phishing: fake trade offer links are used to steal Steam login details or items."
  },
  {
    id: "s8",
    username: "elira.queue",
    avatar: "EL",
    avatarStyle: "pfp-ice",
    avatarImage: "images/profile-pictures/s08_elira.png",
    time: "Today at 11:00",
    source: "Friends Chat",
    message: "Can you invite me to the lobby when you start the game? Also join this Kahoot later: https://kahoot.it/",
    correctIsPhishing: false,
    explanation: "Safe: Kahoot uses the official kahoot.it join domain, and the message does not ask for Steam login details."
  },
  {
    id: "s9",
    username: "KnifeDropLive",
    avatar: "KD",
    avatarStyle: "pfp-crimson",
    avatarImage: "images/profile-pictures/s09_skin_giveaway.png",
    time: "2 days ago",
    source: "Steam Chat",
    message: "Free knife giveaway for the first 50 users. Reserve your drop slot here: https://steamcommunity.com.cs2-drop-center.cos/event/knife-giveaway?slot=50",
    correctIsPhishing: true,
    explanation: "Phishing: fake giveaways are often used to steal Steam accounts."
  },
  {
    id: "s10",
    username: "SteamBillingHelp",
    avatar: "BH",
    avatarStyle: "pfp-steel",
    avatarImage: "images/profile-pictures/s10_billing_alert.png",
    time: "Yesterday at 17:30",
    source: "Steam Message",
    message: "Payment failed for your latest wallet transaction. Update your payment method here: https://store.steampowered.com.billing.wallet-update.xyz/account/payment-method",
    correctIsPhishing: true,
    explanation: "Phishing: payment warnings with random links are dangerous. Always check billing through the official Steam app or website."
  },
  {
    id: "s11",
    username: "LeoPatchNotes",
    avatar: "LP",
    avatarStyle: "pfp-cyan",
    avatarImage: "images/profile-pictures/s11_leo.png",
    time: "Today at 20:15",
    source: "Friends Chat",
    message: "I am downloading the update now. Patch notes are on Steam News: https://store.steampowered.com/news/",
    correctIsPhishing: false,
    explanation: "Safe: this points to the official Steam news page and does not ask the user to sign in through a strange site."
  },
  {
    id: "s12",
    username: "CupStaff_Mira",
    avatar: "CM",
    avatarStyle: "pfp-gold",
    avatarImage: "images/profile-pictures/s12_tournament_staff.png",
    time: "Today at 15:01",
    source: "Steam Chat",
    message: "Your team has been selected for a paid tournament. Complete Steam team check-in here: https://steamcommunity.com.esports-checkin.fs/tournament/team/register",
    correctIsPhishing: true,
    explanation: "Phishing: fake tournaments often use fake Steam login pages."
  },
  {
    id: "s13",
    username: "MiraMidOnly",
    avatar: "MM",
    avatarStyle: "pfp-violet",
    avatarImage: "images/profile-pictures/s13_mira.png",
    time: "Yesterday at 18:05",
    source: "Friends Chat",
    message: "Good game earlier. That last round was close. Clips are in the shared Google Drive folder: https://drive.google.com/",
    correctIsPhishing: false,
    explanation: "Safe: the link uses the official Google Drive domain and the message does not request Steam credentials or codes."
  },
  {
    id: "s14",
    username: "ValveMod-Appeals",
    avatar: "VA",
    avatarStyle: "pfp-operator",
    avatarImage: "images/profile-pictures/s14_steam_moderator_fake.png",
    time: "Today at 22:40",
    source: "Steam Chat",
    message: "Your account will be banned in 1 hour unless you appeal the report here: https://help.steampowered.com.appeal-case.tbv/support/case/SM-1048",
    correctIsPhishing: true,
    explanation: "Phishing: it uses fear and urgency. Real account appeals should only be done through official Steam support."
  },
  {
    id: "s15",
    username: "KeyCrateRewards",
    avatar: "KR",
    avatarStyle: "pfp-gold",
    avatarImage: "images/profile-pictures/s15_game_key_rewards.png",
    time: "2 days ago",
    source: "Steam Message",
    message: "You won a free game key from a weekend publisher reward. Sign in to redeem it: https://store.steampowered.com.key-redemption.dp/rewards/claim-key?campaign=weekend",
    correctIsPhishing: true,
    explanation: "Phishing: unexpected rewards asking for login information are suspicious."
  },
  {
    id: "s16",
    username: "classmate_ron",
    avatar: "CR",
    avatarStyle: "pfp-green",
    avatarImage: "images/profile-pictures/s16_classmate.png",
    time: "Today at 10:25",
    source: "Friends Chat",
    message: "Did you finish the IT project or are you still working on it? I left notes in Google Docs: https://docs.google.com/document/",
    correctIsPhishing: false,
    explanation: "Safe: Google Docs is a legitimate domain here, and the message does not ask for account secrets or unusual verification."
  },
  {
    id: "s17",
    username: "MarketWatchBot",
    avatar: "MW",
    avatarStyle: "pfp-cyan",
    avatarImage: "images/profile-pictures/s17_market_alert.png",
    time: "Today at 08:55",
    source: "Steam Notification",
    message: "Your item sold on the Steam Community Market. Check your official Steam inventory here: https://steamcommunity.com/my/inventory/",
    correctIsPhishing: false,
    explanation: "Safe: this uses the official steamcommunity.com domain and points users to check Steam normally."
  },
  {
    id: "s18",
    username: "InventoryShield.app",
    avatar: "IS",
    avatarStyle: "pfp-ice",
    avatarImage: "images/profile-pictures/s18_inventory_helper.png",
    time: "Yesterday at 23:10",
    source: "Steam Chat",
    message: "Your inventory is at risk after a suspicious trade scan. Connect your account to protect your items: https://steamcommunity.com.inventory-guard.ly/protection/connect-account",
    correctIsPhishing: true,
    explanation: "Phishing: fake inventory protection messages are used to steal items and accounts."
  },
  {
    id: "s19",
    username: "BenFromLobby",
    avatar: "BL",
    avatarStyle: "pfp-neon",
    avatarImage: "images/profile-pictures/s19_ben.png",
    time: "Today at 19:44",
    source: "Friends Chat",
    message: "I sent you a normal Steam invite. Join when ready. We can play Gartic Phone after: https://garticphone.com/",
    correctIsPhishing: false,
    explanation: "Safe: Gartic Phone uses its official domain, and this message does not ask for Steam login details."
  },
  {
    id: "s20",
    username: "TeamVote_Aris",
    avatar: "TV",
    avatarStyle: "pfp-crimson",
    avatarImage: "images/profile-pictures/s20_vote_for_team.png",
    time: "2 days ago",
    source: "Steam Chat",
    message: "Please vote for my team in the community qualifier. Sign in with Steam to vote: https://steamcommunity.com.team-vote-qualifier.ou/openid/vote?team=aris",
    correctIsPhishing: true,
    explanation: "Phishing: fake voting pages are common scams that steal Steam logins."
  },
  {
    id: "s21",
    username: "RefundDesk-Steam",
    avatar: "RD",
    avatarStyle: "pfp-steel",
    avatarImage: "images/profile-pictures/s21_refund_scam.png",
    time: "Yesterday at 12:12",
    source: "Steam Message",
    message: "You are eligible for a refund on a recent purchase. Confirm your payout details here: https://store.steampowered.com.refund-claims.qm/claims/bank-confirmation",
    correctIsPhishing: true,
    explanation: "Phishing: fake refund messages asking for bank details are dangerous."
  },
  {
    id: "s22",
    username: "DionLatency",
    avatar: "DL",
    avatarStyle: "pfp-ember",
    avatarImage: "images/profile-pictures/s22_dion.png",
    time: "Today at 13:05",
    source: "Friends Chat",
    message: "The server was lagging, so I left the match. I checked the status page: https://steamstat.us/",
    correctIsPhishing: false,
    explanation: "Safe: this is normal game-related chat with a well-known Steam status site and no private information request."
  },
  {
    id: "s23",
    username: "BetaInviteHub",
    avatar: "BI",
    avatarStyle: "pfp-cyan",
    avatarImage: "images/profile-pictures/s23_beta_access.png",
    time: "Today at 01:30",
    source: "Steam Chat",
    message: "You were chosen for early beta access. Download the private playtest launcher here: https://steamcommunity.com.playtest-access.qf/beta-client/download",
    correctIsPhishing: true,
    explanation: "Phishing/malware: unexpected downloads from unknown links can be unsafe."
  },
  {
    id: "s24",
    username: "AceFrom2019",
    avatar: "AF",
    avatarStyle: "pfp-violet",
    avatarImage: "images/profile-pictures/s24_old_friend.png",
    time: "Yesterday at 02:18",
    source: "Friends Chat",
    message: "Is this your Steam profile? https://steamcommunity.com.profile-viewer.mi/profiles/76561198012345678",
    correctIsPhishing: true,
    explanation: "Phishing: vague messages with short or unknown links are often sent from hacked accounts."
  },
  {
    id: "s25",
    username: "SaleTrackerSteam",
    avatar: "ST",
    avatarStyle: "pfp-green",
    avatarImage: "images/profile-pictures/s25_steam_sale_news.png",
    time: "Today at 07:50",
    source: "Group Announcement",
    message: "The Steam seasonal sale has started. Check deals from the official Steam store page: https://store.steampowered.com/",
    correctIsPhishing: false,
    explanation: "Safe: it points users to the official Steam store domain and does not include a fake external link."
  }
];

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

const selectedChallenges = shuffleArray(allSteamChallenges).slice(0, 10);

let currentIndex = 0;
const answers = Array(selectedChallenges.length).fill(null);
const revealedAnswers = Array(selectedChallenges.length).fill(false);
let attemptSaved = false;

const usernameEl = document.getElementById("username");
const messageUsernameEl = document.getElementById("messageUsername");
const avatarEl = document.getElementById("avatar");
const timeEl = document.getElementById("time");
const sourceEl = document.getElementById("source");
const messageBodyEl = document.getElementById("messageBody");
const steamContactListEl = document.getElementById("steamContactList");
const qIndexEl = document.getElementById("qIndex");
const scoreMetaEl = document.getElementById("scoreMeta");
const progressBarEl = document.getElementById("progressBar");
const feedbackCardEl = document.getElementById("feedbackCard");
const feedbackEl = document.getElementById("feedback");
const answerStateEl = document.getElementById("answerState");
const summaryCardEl = document.getElementById("summaryCard");
const controlsCardEl = document.getElementById("controlsCard");
const summaryTextEl = document.getElementById("summaryText");
const summaryListEl = document.getElementById("summaryList");
const btnSafe = document.getElementById("btnSafe");
const btnPhish = document.getElementById("btnPhish");
const revealAnswerBtn = document.getElementById("revealAnswer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const summaryRestartBtn = document.getElementById("summaryRestartBtn");

function computeScore() {
  return selectedChallenges.reduce((score, challenge, index) => {
    return answers[index] === challenge.correctIsPhishing ? score + 1 : score;
  }, 0);
}

function setFeedback(kind, title, explanation) {
  feedbackCardEl.classList.remove("hidden");
  feedbackEl.className = `result ${kind}`;
  feedbackEl.classList.remove("hidden");
  feedbackEl.textContent = "";

  const titleEl = document.createElement("strong");
  titleEl.textContent = title;

  const explanationEl = document.createElement("div");
  explanationEl.style.marginTop = "8px";
  explanationEl.style.color = "var(--muted)";
  explanationEl.textContent = explanation;

  feedbackEl.appendChild(titleEl);
  feedbackEl.appendChild(explanationEl);
}

function clearFeedback() {
  feedbackCardEl.classList.add("hidden");
  feedbackEl.className = "result hidden";
  feedbackEl.textContent = "";
}

function getPreview(message) {
  return message.length > 58 ? `${message.slice(0, 58)}...` : message;
}

function getContactState(index) {
  if (answers[index] !== null) return answers[index] ? "Phishing" : "Safe";
  if (revealedAnswers[index]) return "Answer revealed";
  return "Unread challenge";
}

function getContactStateClass(index) {
  if (answers[index] !== null) {
    return answers[index] === selectedChallenges[index].correctIsPhishing ? "correct" : "wrong";
  }

  return revealedAnswers[index] ? "revealed" : "unread";
}

function getAvatarClass(challenge) {
  return challenge.avatarStyle || "pfp-operator";
}

function applyAvatarImage(element, challenge) {
  if (challenge.avatarImage) {
    element.classList.add("has-image");
    element.style.backgroundImage = `url("${challenge.avatarImage}")`;
    return;
  }

  element.classList.remove("has-image");
  element.style.backgroundImage = "";
}

function updateAnswerButtons(challenge, answer) {
  [btnSafe, btnPhish].forEach((button) => {
    button.classList.remove("answer-selected", "answer-correct", "answer-wrong");
  });

  if (answer === null) return;

  const chosenButton = answer ? btnPhish : btnSafe;
  const isCorrect = answer === challenge.correctIsPhishing;
  chosenButton.classList.add("answer-selected", isCorrect ? "answer-correct" : "answer-wrong");
}

function renderContactList() {
  steamContactListEl.textContent = "";

  selectedChallenges.forEach((challenge, index) => {
    const contactButton = document.createElement("button");
    contactButton.type = "button";
    contactButton.className = `steam-contact${index === currentIndex ? " active" : ""}`;
    contactButton.setAttribute("aria-label", `Open message from ${challenge.username}`);

    const avatar = document.createElement("span");
    avatar.className = `steam-contact-avatar ${getAvatarClass(challenge)}`;
    avatar.textContent = challenge.avatar;
    applyAvatarImage(avatar, challenge);

    const main = document.createElement("span");
    main.className = "steam-contact-main";

    const top = document.createElement("span");
    top.className = "steam-contact-top";

    const name = document.createElement("span");
    name.className = "steam-contact-name";
    name.textContent = challenge.username;

    const time = document.createElement("span");
    time.className = "steam-contact-time";
    time.textContent = challenge.time.replace("Today at ", "").replace("Yesterday at ", "Y ");

    const preview = document.createElement("span");
    preview.className = "steam-contact-preview";
    preview.textContent = getPreview(challenge.message);

    const state = document.createElement("span");
    state.className = `steam-contact-state ${getContactStateClass(index)}`;
    state.textContent = getContactState(index);

    top.appendChild(name);
    top.appendChild(time);
    main.appendChild(top);
    main.appendChild(preview);
    main.appendChild(state);
    contactButton.appendChild(avatar);
    contactButton.appendChild(main);

    contactButton.addEventListener("click", () => {
      currentIndex = index;
      renderChallenge();
    });

    steamContactListEl.appendChild(contactButton);
  });
}

function renderStoredFeedback() {
  const challenge = selectedChallenges[currentIndex];
  const answer = answers[currentIndex];

  if (answer !== null) {
    const isCorrect = answer === challenge.correctIsPhishing;
    const correctLabel = challenge.correctIsPhishing ? "Phishing" : "Safe";
    const userLabel = answer ? "Phishing" : "Safe";
    const title = isCorrect
      ? `Correct: this message is ${correctLabel}.`
      : `Incorrect: you chose ${userLabel}, but this is ${correctLabel}.`;

    setFeedback(isCorrect ? "good" : "bad", title, challenge.explanation);
    return;
  }

  if (revealedAnswers[currentIndex]) {
    const correctLabel = challenge.correctIsPhishing ? "Phishing" : "Safe";
    const kind = challenge.correctIsPhishing ? "bad" : "good";
    setFeedback(kind, `Answer: ${correctLabel}`, challenge.explanation);
    return;
  }

  clearFeedback();
}

function renderChallenge() {
  const challenge = selectedChallenges[currentIndex];
  const answer = answers[currentIndex];

  usernameEl.textContent = challenge.username;
  messageUsernameEl.textContent = challenge.username;
  avatarEl.className = `steam-avatar ${getAvatarClass(challenge)}`;
  avatarEl.textContent = challenge.avatar;
  applyAvatarImage(avatarEl, challenge);
  timeEl.textContent = challenge.time;
  sourceEl.textContent = challenge.source;
  messageBodyEl.textContent = challenge.message;
  qIndexEl.textContent = `${currentIndex + 1} / ${selectedChallenges.length}`;
  progressBarEl.style.width = `${((currentIndex + 1) / selectedChallenges.length) * 100}%`;
  scoreMetaEl.textContent = `Score: ${computeScore()} / ${selectedChallenges.length}`;
  updateAnswerButtons(challenge, answer);

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === selectedChallenges.length - 1 ? "Finish" : "Next";

  if (answer === null) {
    answerStateEl.textContent = revealedAnswers[currentIndex] ? "Answer revealed" : "Unanswered";
  } else {
    answerStateEl.textContent = `Your answer: ${answer ? "Phishing" : "Safe"}`;
  }

  summaryCardEl.classList.add("hidden");
  controlsCardEl.classList.remove("hidden");
  renderContactList();
  renderStoredFeedback();
}

function submitAnswer(markedPhishing) {
  answers[currentIndex] = markedPhishing;
  revealedAnswers[currentIndex] = false;
  renderChallenge();
}

function revealAnswer() {
  revealedAnswers[currentIndex] = true;
  renderChallenge();
}

function showSummary() {
  const score = computeScore();
  const answeredCount = answers.filter((answer) => answer !== null).length;

  controlsCardEl.classList.add("hidden");
  feedbackCardEl.classList.add("hidden");
  summaryCardEl.classList.remove("hidden");
  progressBarEl.style.width = "100%";
  scoreMetaEl.textContent = `Score: ${score} / ${selectedChallenges.length}`;

  summaryTextEl.textContent = `You scored ${score} out of ${selectedChallenges.length}. Answered ${answeredCount} of ${selectedChallenges.length} challenges.`;
  summaryListEl.textContent = "";

  selectedChallenges.forEach((challenge, index) => {
    const item = document.createElement("div");
    item.className = "summary-item";

    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${challenge.username}`;

    const answer = answers[index];
    const correctLabel = challenge.correctIsPhishing ? "Phishing" : "Safe";
    const userLabel = answer === null ? "No answer" : answer ? "Phishing" : "Safe";
    const isCorrect = answer === challenge.correctIsPhishing;

    const details = document.createElement("small");
    details.textContent = `Your answer: ${userLabel} | Correct answer: ${correctLabel} | ${isCorrect ? "Correct" : "Review needed"}`;

    const message = document.createElement("small");
    message.textContent = challenge.explanation;

    item.appendChild(title);
    item.appendChild(details);
    item.appendChild(message);
    summaryListEl.appendChild(item);
  });

  saveSteamAttempt();
}

async function saveSteamAttempt() {
  if (attemptSaved) return;
  attemptSaved = true;

  // Session is saved by auth.js after login/register.
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("pas_session") || "null");
  } catch (e) {}

  if (!session || !session.id) return;

  const score = computeScore();
  const answerRows = selectedChallenges.map((q, index) => ({
    questionId: q.id,
    questionLabel: q.username + " - " + q.message.slice(0, 80),
    userSelectedIsPhishing: answers[index] === true,
    correctIsPhishing: q.correctIsPhishing === true
  }));

  try {
    await fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.id,
        quizTypeName: "Steam",
        score: score,
        totalQuestions: selectedChallenges.length,
        answers: answerRows
      })
    });
  } catch (e) {
    // Keep UI working even if save fails.
  }
}

function restartQuiz() {
  currentIndex = 0;
  answers.fill(null);
  revealedAnswers.fill(false);
  attemptSaved = false;
  renderChallenge();
}

btnSafe.addEventListener("click", () => submitAnswer(false));
btnPhish.addEventListener("click", () => submitAnswer(true));
revealAnswerBtn.addEventListener("click", revealAnswer);

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderChallenge();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < selectedChallenges.length - 1) {
    currentIndex++;
    renderChallenge();
  } else {
    showSummary();
  }
});

restartBtn.addEventListener("click", restartQuiz);
summaryRestartBtn.addEventListener("click", restartQuiz);

window.addEventListener("keydown", (event) => {
  if (event.key === "1") submitAnswer(false);
  if (event.key === "2") submitAnswer(true);
  if (event.key === "ArrowLeft") prevBtn.click();
  if (event.key === "ArrowRight") nextBtn.click();
});

renderChallenge();



