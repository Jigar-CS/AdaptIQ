import { useCallback, useRef, useState } from 'react';
import adaptiveService from '../services/adaptiveService';

/**
 * Manages client-side state for a single adaptive test session
 * (works for both topic_adaptive and full_adaptive — the engine is shared).
 *
 * Usage:
 *   const test = useAdaptiveTest();
 *   await test.start(topicId); // topicId omitted => full_adaptive (Miscellaneous)
 *   test.currentQuestion, test.batchNumber, test.difficulty, test.progress...
 *   await test.answer(selectedOption);
 *   await test.finish();
 */
const BATCH_SIZE = 5;
const TOTAL_QUESTIONS = 20;

export default function useAdaptiveTest() {
  const [testId, setTestId] = useState(null);
  const [testType, setTestType] = useState(null);
  const [difficulty, setDifficulty] = useState('Easy');
  const [batch, setBatch] = useState([]);
  const [batchNumber, setBatchNumber] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null); // { isCorrect, explanation }
  const [status, setStatus] = useState('idle'); // idle | loading | active | completed | error
  const [error, setError] = useState('');
  const questionStartRef = useRef(Date.now());

  const currentQuestion = batch[questionIndex] || null;
  const progress = Math.min(100, Math.round((answered / TOTAL_QUESTIONS) * 100));

  const start = useCallback(async (topicId) => {
    setStatus('loading');
    setError('');
    try {
      const data = await adaptiveService.start(topicId);
      setTestId(data.test_id || data.id);
      setTestType(data.test_type);
      setDifficulty(data.difficulty || 'Easy');
      const nextBatch = await adaptiveService.getNextBatch(data.test_id || data.id);
      setBatch(nextBatch.questions || []);
      setBatchNumber(nextBatch.batch_number || 1);
      setQuestionIndex(0);
      setAnswered(0);
      setCorrectCount(0);
      questionStartRef.current = Date.now();
      setStatus('active');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Unable to start the test.');
      setStatus('error');
    }
  }, []);

  const answer = useCallback(async (selectedOption) => {
    if (!currentQuestion || !testId) return;
    const responseTimeSeconds = (Date.now() - questionStartRef.current) / 1000;

    try {
      const result = await adaptiveService.submitAnswer(testId, {
        question_id: currentQuestion.id,
        selected_option: selectedOption,
        response_time_seconds: responseTimeSeconds,
      });

      setFeedback({ isCorrect: result.is_correct, explanation: result.explanation });
      setAnswered((n) => n + 1);
      if (result.is_correct) setCorrectCount((n) => n + 1);
      if (result.new_difficulty) setDifficulty(result.new_difficulty);

      return result;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit answer.');
      throw err;
    }
  }, [currentQuestion, testId]);

  const nextQuestion = useCallback(async () => {
    setFeedback(null);
    questionStartRef.current = Date.now();

    if (questionIndex + 1 < batch.length) {
      setQuestionIndex((i) => i + 1);
      return;
    }

    if (answered >= TOTAL_QUESTIONS) {
      await finish();
      return;
    }

    // Fetch next batch
    setStatus('loading');
    try {
      const nextBatch = await adaptiveService.getNextBatch(testId);
      setBatch(nextBatch.questions || []);
      setBatchNumber(nextBatch.batch_number || batchNumber + 1);
      setQuestionIndex(0);
      setStatus('active');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load next batch.');
      setStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, batch.length, answered, testId, batchNumber]);

  const finish = useCallback(async () => {
    if (!testId) return;
    setStatus('loading');
    try {
      const result = await adaptiveService.complete(testId);
      setStatus('completed');
      return result;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to complete the test.');
      setStatus('error');
    }
  }, [testId]);

  return {
    testId,
    testType,
    difficulty,
    currentQuestion,
    batchNumber,
    questionIndex,
    answered,
    correctCount,
    progress,
    feedback,
    status,
    error,
    totalQuestions: TOTAL_QUESTIONS,
    batchSize: BATCH_SIZE,
    start,
    answer,
    nextQuestion,
    finish,
  };
}
