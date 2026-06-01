            // random emaila
            window.addEventListener('load', () => {
                if (typeof questions === 'undefined' || !Array.isArray(questions)) return;

                const extras = [
                    {
                        fromName: 'Account Alerts',
                        fromEmail: 'alerts@banking.example',
                        subject: 'Unusual activity on your account',
                        avatar: 'AA',
                        body: `We noticed an unusual login to your account. If this wasn't you, please review immediately: https://banking.example/security`,
                        rawHeaders: `From: Account Alerts <alerts@banking.example>`,
                        correctIsPhishing: false,
                        explanation: 'Legitimate-looking alert. If unsure, visit the site directly rather than using links.'
                    },
                    {
                        fromName: 'Tax Office',
                        fromEmail: 'notifications@taxoffice.example',
                        subject: 'Immediate action required: tax refund',
                        avatar: 'TO',
                        body: `You are eligible for a tax refund. Click here to claim: http://tinyurl.com/refund-now`,
                        rawHeaders: `From: Tax Office <notifications@taxoffice.example>`,
                        correctIsPhishing: true,
                        explanation: 'Scam: unexpected refunds and shortened links are red flags.'
                    },
                    {
                        fromName: 'Maintenance',
                        fromEmail: 'maintenance@it.example',
                        subject: 'Scheduled maintenance tonight',
                        avatar: 'MT',
                        body: `Dear user,\n\nWe will perform scheduled maintenance tonight from 00:00 to 02:00. No action required.`,
                        rawHeaders: `From: Maintenance <maintenance@it.example>`,
                        correctIsPhishing: false,
                        explanation: 'Routine notification. Confirm sender domain and contact channels if unsure.'
                    },
                    {
                        fromName: 'Delivery',
                        fromEmail: 'support@deliveries.example',
                        subject: 'Delivery problem: update address',
                        avatar: 'DL',
                        body: `We could not deliver your package. Click to update address: https://deliveries.example/update/12345`,
                        rawHeaders: `From: Delivery Support <support@deliveries.example>`,
                        correctIsPhishing: true,
                        explanation: 'Phishing: unexpected delivery issue with a link asking for personal info can be malicious.'
                    },
                    {
                        fromName: 'Colleague',
                        fromEmail: 'jane.doe@british-gymnasium.edu',
                        subject: 'Fwd: Please review this document',
                        avatar: 'JD',
                        body: `Hi,\n\nPlease see the attached invoice. Let me know if you have questions.`,
                        rawHeaders: `From: Jane Doe <jane.doe@british-gymnasium.edu>`,
                        correctIsPhishing: false,
                        explanation: 'If attachment is unexpected, verify with sender before opening.'
                    }
                ];

                // sa extra emaila mi shti
                const extraCount = Math.floor(Math.random() * 4) + 1;
                for (let i = 0; i < extraCount; i++) {
                    const t = extras[Math.floor(Math.random() * extras.length)];
                    // copy tjeter me id
                    const variation = Object.assign({}, t);
                    variation.id = 'rnd-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000);
                    variation.subject = variation.subject + (Math.random() < 0.4 ? ' (Action needed)' : '');
                    variation.date = ['Today', 'Yesterday', '2 days ago', 'Last week'][Math.floor(Math.random() * 4)];
                    variation.avatar = variation.avatar || variation.fromName.slice(0, 2).toUpperCase();
                    questions.push(variation);
                }

                // ndroj pytjet qdo her qe bon refresh
                for (let i = questions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [questions[i], questions[j]] = [questions[j], questions[i]];
                }

                // reseto answers array per length ri
                if (typeof answers !== 'undefined' && Array.isArray(answers)) {
                    answers.length = questions.length;
                    for (let k = 0; k < answers.length; k++) answers[k] = null;
                }

                if (typeof idx !== 'undefined') idx = 0;
                if (typeof render === 'function') render();
            });
        
        // quiz data
        const questions = [
            {
                id: 'q1',
                fromName: 'IT Service Desk',
                fromEmail: 'it-support@british-gymnasium.edu', // legitimate-looking
                subject: 'Password reset required for your account',
                date: '2 hours ago',
                avatar: 'IT',
                body: `Hello Amar,\n\nOur records show your account password expired. Please reset it within 24 hours to avoid temporary lockout.\n\nReset link: https://british-gymnasium.edu/account/reset\n\nIf you did not request this, contact IT Helpdesk.`,
                rawHeaders: `From: "IT Service Desk" <it-support@british-gymnasium.edu>\nReply-To: helpdesk@british-gymnasium.edu\nReceived: from mail.british-gymnasium.edu (mail.british-gymnasium.edu [198.51.100.12])`,
                correctIsPhishing: false,
                explanation: 'Legitimate: sender address matches organization domain and link points to the same domain. Always hover links to confirm; this example is consistent.'
            },
            {
                id: 'q2',
                fromName: 'Google Security',
                fromEmail: 'secure@googl3.com', // typo in domain
                subject: 'Unusual sign-in attempt detected',
                date: 'Yesterday',
                avatar: 'GS',
                body: `We detected an unusual sign-in attempt. Verify your account now: http://verify-google.security-check.com/login\n\nIf you ignore this, your account will be suspended.`,
                rawHeaders: `From: "Google Security" <secure@googl3.com>\nReceived-SPF: neutral (example)`,
                correctIsPhishing: true,
                explanation: 'Phishing: sender domain uses a misspelling (googl3.com) and the link goes to an unrelated domain. Threatening language and urgency are common red flags.'
            },
            {
                id: 'q3',
                fromName: 'HR',
                fromEmail: 'hr@british-gymnasium.edu',
                subject: 'Action required: Update tax form',
                date: '3 days ago',
                avatar: 'HR',
                body: `Hello,\n\nPlease open the attached form "tax_update.doc" and enable macros to complete the form.\n\nRegards,\nHR`,
                rawHeaders: `From: HR <hr@british-gymnasium.edu>\nAttachment: tax_update.doc`,
                correctIsPhishing: true,
                explanation: 'Phishing/malware: legitimate organizations will not ask you to enable macros in documents. Attachments requesting macros are suspicious.'
            },
            {
                id: 'q4',
                fromName: 'Billing',
                fromEmail: 'billing@paypal.com',
                subject: 'Receipt for your payment',
                date: 'Today',
                avatar: 'PB',
                body: `Hi,\n\nThank you for your payment of $15.00. View receipt: https://www.paypal.com/invoice/p/12345\n\nNo action required.`,
                rawHeaders: `From: PayPal <billing@paypal.com>\nDKIM: pass`,
                correctIsPhishing: false,
                explanation: 'Legitimate: expected sender domain and neutral language. If unsure, navigate to the service directly (not via the link) and check your account activity.'
            },
            {
                id: 'q5',
                fromName: 'Survey Rewards',
                fromEmail: 'rewards@survey.example',
                subject: 'Win a £500 voucher — complete this short survey',
                date: '4 days ago',
                avatar: 'SR',
                body: `Congratulations! You have been selected to win a £500 voucher. Click to claim: http://bit.ly/claim-voucher`,
                rawHeaders: `From: rewards@survey.example\nList-Unsubscribe: <mailto:unsubscribe@survey.example>`,
                correctIsPhishing: true,
                explanation: 'Phishing/scam: unexpected prize offers and shortened links are typical indicators. Treat unsolicited reward emails with suspicion.'
            }
        ];

        let idx = 0;
        const answers = Array(questions.length).fill(null); // true if user marked phishing, false if legitimate, null = unanswered
        let attemptSaved = false;
        const avatarEl = document.getElementById('avatar');
        const fromNameEl = document.getElementById('fromName');
        const fromEmailEl = document.getElementById('fromEmail');
        const subjectEl = document.getElementById('subject');
        const dateEl = document.getElementById('date');
        const emailBodyEl = document.getElementById('emailBody');
        const rawHeadersEl = document.getElementById('rawHeaders');
        const toggleHeadersBtn = document.getElementById('toggleHeaders');
        const btnLeg = document.getElementById('btnLeg');
        const btnPhish = document.getElementById('btnPhish');
        const feedbackEl = document.getElementById('feedback');
        const indicatorsEl = document.getElementById('indicators');
        const qIndexEl = document.getElementById('qIndex');
        const progressBar = document.getElementById('progressBar');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const revealBtn = document.getElementById('revealAnswer');
        const scoreMeta = document.getElementById('scoreMeta');
        const summaryCard = document.getElementById('summaryCard');
        const controlsCard = document.getElementById('controlsCard');
        const summaryText = document.getElementById('summaryText');
        const restartBtn = document.getElementById('restartBtn');

        function render() {
            const q = questions[idx];
            avatarEl.textContent = q.avatar || q.fromName.slice(0,2).toUpperCase();
            fromNameEl.textContent = q.fromName;
            fromEmailEl.textContent = q.fromEmail;
            subjectEl.textContent = q.subject;
            dateEl.textContent = q.date;
            emailBodyEl.textContent = q.body;
            rawHeadersEl.textContent = q.rawHeaders;
            rawHeadersEl.classList.add('hidden');
            toggleHeadersBtn.textContent = 'Show headers';
            feedbackEl.classList.add('hidden');
            indicatorsEl.classList.add('hidden');
            qIndexEl.textContent = (idx+1) + ' / ' + questions.length;
            progressBar.style.width = ((idx)/questions.length*100) + '%';
            prevBtn.disabled = idx === 0;
            nextBtn.textContent = idx === questions.length -1 ? 'Finish' : 'Next';
            scoreMeta.textContent = `Score: ${computeScore()} / ${questions.length}`;
            summaryCard.classList.add('hidden');
            controlsCard.classList.remove('hidden');
            // nese zgjidhur trego feedback
            const ans = answers[idx];
            if (ans !== null) {
                showFeedback(ans, false); // kshyr a o mir a jo pa shku te tjetra
            }
        }

        function computeScore() {
            let s = 0;
            for (let i=0;i<questions.length;i++){
                if (answers[i] === null) continue;
                const userMarkedPhish = answers[i];
                if (userMarkedPhish === questions[i].correctIsPhishing) s++;
            }
            return s;
        }

        function showFeedback(userMarkedPhish, revealExplanation = true) {
            const q = questions[idx];
            const isCorrect = userMarkedPhish === q.correctIsPhishing;
            feedbackEl.className = 'result';
            feedbackEl.classList.add(isCorrect ? 'good' : 'bad');
            feedbackEl.classList.remove('hidden');
            feedbackEl.textContent = isCorrect ? 'Correct' : 'Incorrect';
            if (revealExplanation) {
                const expl = document.createElement('div');
                expl.style.marginTop = '8px';
                expl.style.color = 'var(--muted)';
                expl.textContent = q.explanation;
                feedbackEl.appendChild(expl);
            } else {
                const expl = document.createElement('div');
                expl.style.marginTop = '8px';
                expl.style.color = 'var(--muted)';
                expl.textContent = q.explanation;
                feedbackEl.appendChild(expl);
            }

            const indicators = [];
            // suspicious link (contains spaces? or different domain?) simple heuristics
            if (/http:\/\/|bit\.ly|shorturl|security-check|verify-|verify-|\.com\/invoice\/p\/\d+/.test(q.body.toLowerCase())) {
                // not a reliable test; just flag shortened and external patterns
            }
            // check for mismatched domain (basic heuristic: visible domain not equal to from domain)
            const bodyLinks = Array.from(q.body.matchAll(/https?:\/\/[^\s)]+/gi)).map(m=>m[0]);
            if (bodyLinks.length) {
                bodyLinks.forEach(link=>{
                    try {
                        const u = new URL(link);
                        const linkHost = u.hostname.toLowerCase();
                        const fromHost = q.fromEmail.split('@')[1] ? q.fromEmail.split('@')[1].toLowerCase() : '';
                        if (fromHost && linkHost && !linkHost.includes(fromHost.split('.').slice(-2).join('.'))) {
                            indicators.push('Link domain does not match sender domain');
                        }
                        if (link.length < 30 || link.includes('bit.ly') || link.includes('short')) {
                            indicators.push('Shortened or obscured link');
                        }
                        if (link.startsWith('http://')) indicators.push('Link uses insecure HTTP (not HTTPS)');
                    } catch(e){}
                });
            }
            if (/enable macros|enable content/.test(q.body.toLowerCase())) {
                indicators.push('Attachment asks to enable macros (dangerous)');
            }
            if (/selected to win|congratulations|you have been selected|claim voucher/i.test(q.subject + ' ' + q.body)) {
                indicators.push('Unexpected prize or reward promise');
            }
            if (/@\w+\.\w{1,3}\d/.test(q.fromEmail)) {
                indicators.push('Sender address contains unusual characters or typos');
            }
            if (indicators.length){
                indicatorsEl.classList.remove('hidden');
                indicatorsEl.innerHTML = '<strong>Indicators:</strong><ul style="margin:6px 0 0 18px;color:var(--muted)"><li>' + indicators.join('</li><li>') + '</li></ul>';
            } else {
                indicatorsEl.classList.add('hidden');
                indicatorsEl.textContent = '';
            }

            scoreMeta.textContent = `Score: ${computeScore()} / ${questions.length}`;
        }

        // Button handlers
        btnLeg.addEventListener('click', ()=>submitAnswer(false));
        btnPhish.addEventListener('click', ()=>submitAnswer(true));
        toggleHeadersBtn.addEventListener('click', ()=>{
            rawHeadersEl.classList.toggle('hidden');
            toggleHeadersBtn.textContent = rawHeadersEl.classList.contains('hidden') ? 'Show headers' : 'Hide headers';
            rawHeadersEl.setAttribute('aria-hidden', rawHeadersEl.classList.contains('hidden') ? 'true' : 'false');
        });

        prevBtn.addEventListener('click', ()=>{
            if (idx > 0) {
                idx--;
                render();
            }
        });

        nextBtn.addEventListener('click', ()=>{
            if (idx < questions.length -1) {
                idx++;
                render();
            } else {
                // Finish - show summary
                showSummary();
            }
        });

        revealBtn.addEventListener('click', ()=>{
            // kallzo a o legit a phishing
            const q = questions[idx];
            feedbackEl.classList.remove('hidden');
            feedbackEl.className = 'result';
            if (q.correctIsPhishing) feedbackEl.classList.add('bad'); else feedbackEl.classList.add('good');
            feedbackEl.textContent = q.correctIsPhishing ? 'Answer: Phishing' : 'Answer: Legitimate';
            const expl = document.createElement('div');
            expl.style.marginTop = '8px';
            expl.style.color = 'var(--muted)';
            expl.textContent = q.explanation;
            feedbackEl.appendChild(expl);
            indicatorsEl.classList.remove('hidden');
            // Also mark as answered (but do not affect score unless user chose)
        });

        function submitAnswer(markPhishing) {
            answers[idx] = markPhishing;
            showFeedback(markPhishing, true);
            setTimeout(()=>{
                if (idx < questions.length -1) {
                    idx++;
                    render();
                } else {
                    showSummary();
                }
            }, 900);
        }

        function showSummary() {
            controlsCard.classList.add('hidden');
            summaryCard.classList.remove('hidden');
            const score = computeScore();
            summaryText.innerHTML = `You scored ${score} out of ${questions.length}.<br><br>`;
            summaryText.innerHTML += `<strong>Review:</strong><ul style="margin:8px 0 0 18px">`;
            questions.forEach((q,i)=>{
                const user = answers[i];
                const userText = user === null ? 'No answer' : (user ? 'Marked as phishing' : 'Marked as legitimate');
                const correctText = q.correctIsPhishing ? 'Phishing' : 'Legitimate';
                summaryText.innerHTML += `<li><strong>${q.subject}</strong><br><small style="color:var(--muted)">${userText} — Actual: ${correctText}</small></li>`;
            });
            summaryText.innerHTML += '</ul>';
            progressBar.style.width = '100%';
            scoreMeta.textContent = `Score: ${score} / ${questions.length}`;
            saveEmailAttempt();
        }

        async function saveEmailAttempt() {
            if (attemptSaved) return;
            attemptSaved = true;

            // Session is saved by auth.js after login/register.
            let session = null;
            try {
                session = JSON.parse(localStorage.getItem('pas_session') || 'null');
            } catch (e) {}

            if (!session || !session.id) return;

            const score = computeScore();
            const answerRows = questions.map((q, i) => ({
                questionId: q.id,
                questionLabel: q.subject,
                userSelectedIsPhishing: answers[i] === true,
                correctIsPhishing: q.correctIsPhishing === true
            }));

            try {
                await fetch('/api/quiz-attempts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: session.id,
                        quizTypeName: 'Email',
                        score: score,
                        totalQuestions: questions.length,
                        answers: answerRows
                    })
                });
            } catch (e) {
                // Keep UI working even if save fails.
            }
        }

        restartBtn.addEventListener('click', ()=>{
            idx = 0;
            for (let i=0;i<answers.length;i++) answers[i]=null;
            attemptSaved = false;
            render();
        });

        render();

        // shortcuts
        window.addEventListener('keydown', (e)=>{
            if (e.key === '1') submitAnswer(false);
            if (e.key === '2') submitAnswer(true);
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
        });
