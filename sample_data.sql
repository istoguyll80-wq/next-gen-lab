INSERT OR IGNORE INTO QuizTypes (name, description) VALUES
('Email', 'Email phishing simulation questions'),
('Steam', 'Steam/chat phishing simulation questions');

INSERT OR IGNORE INTO Questions (quiz_type_id, question_text, correct_is_phishing, explanation)
SELECT qt.id, 'Unusual sign-in attempt detected. Verify account at http://verify-google.security-check.com/login', 1, 'Misspelled sender/domain and suspicious verification link.'
FROM QuizTypes qt WHERE qt.name = 'Email';

INSERT OR IGNORE INTO Questions (quiz_type_id, question_text, correct_is_phishing, explanation)
SELECT qt.id, 'Receipt for your payment from billing@paypal.com with paypal.com link.', 0, 'Sender and domain look consistent for a normal receipt.'
FROM QuizTypes qt WHERE qt.name = 'Email';

INSERT OR IGNORE INTO Questions (quiz_type_id, question_text, correct_is_phishing, explanation)
SELECT qt.id, 'Steam account reported. Review case: steamcommunity.com.security-review.account-check.ex', 1, 'Fake Steam domain pattern and urgent language are red flags.'
FROM QuizTypes qt WHERE qt.name = 'Steam';

INSERT OR IGNORE INTO Questions (quiz_type_id, question_text, correct_is_phishing, explanation)
SELECT qt.id, 'Friend message to join official Steam store link.', 0, 'Normal message with official domain and no credential request.'
FROM QuizTypes qt WHERE qt.name = 'Steam';