import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Clock,
  Bot,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Flag,
  Code2,
  FolderGit2,
  Users,
  AlertTriangle,
  X,
  Loader2,
  Camera,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import AudioWaveform from '../components/AudioWaveform';
import { useApp } from '../context/AppContext';
import { apiSaveProctoringEvent } from '../services/api';

/* ─── Constants ─────────────────────────────────────────────── */
const QUESTION_TIME_SECS = 180; // 3 minutes per question

const TYPE_META = {
  Technical: {
    icon: Code2,
    badge: 'purple',
    label: 'Domain / Technical',
    bg: 'bg-purple-500/10 border-purple-500/30',
    text: 'text-purple-300',
  },
  Domain: {
    icon: Code2,
    badge: 'purple',
    label: 'Domain Knowledge',
    bg: 'bg-purple-500/10 border-purple-500/30',
    text: 'text-purple-300',
  },
  Project: {
    icon: FolderGit2,
    badge: 'blue',
    label: 'Project',
    bg: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-300',
  },
  HR: {
    icon: Users,
    badge: 'cyan',
    label: 'Behavioural',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
    text: 'text-cyan-300',
  },
};

/* ─── Webcam Permission Gate ─────────────────────────────────── */
const WebcamPermissionGate = ({ onGranted, onDenied }) => (
  <div className="min-h-[calc(100vh-4.5rem)] bg-[#070a14] flex items-center justify-center px-4">
    <div className="max-w-sm w-full space-y-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30">
        <Camera className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Enable Webcam</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          InterVue AI requires webcam access for proctored interview simulation. Your video is{' '}
          <span className="text-white font-medium">not recorded or transmitted</span> — it only displays locally.
        </p>
      </div>
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-left space-y-2">
        <p className="font-semibold text-slate-300">What we access:</p>
        <p>✅ Webcam video stream (local display only)</p>
        <p>✅ Microphone for speech-to-text dictation</p>
        <p>❌ No recording, storage, or transmission</p>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={onGranted}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 transition-all"
        >
          <Camera className="w-4 h-4" />
          Allow Camera & Start Interview
        </button>
        <button
          onClick={onDenied}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
        >
          Skip webcam — continue without camera
        </button>
      </div>
    </div>
  </div>
);

/* ─── Tab-Switch Warning Banner ──────────────────────────────── */
const TabWarningBanner = ({ count, onDismiss }) => (
  <div className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
    <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/90 backdrop-blur-sm border border-amber-400 shadow-xl text-black max-w-lg w-full animate-bounce-once">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1 text-sm font-semibold">
        Tab switch detected! ({count} time{count > 1 ? 's' : ''}) — This has been logged.
      </div>
      <button onClick={onDismiss} className="p-1 hover:bg-black/10 rounded-lg">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

/* ─── Main Interview Page ─────────────────────────────────────── */
export const InterviewPage = () => {
  const {
    currentQuestions,
    recordAnswer,
    recordProctoringEvent,
    userAnswers,
    completeInterview,
    activeInterviewId,
    resumeData,
  } = useApp();
  const navigate = useNavigate();

  /* Permission gate state */
  const [permissionPhase, setPermissionPhase] = useState('asking'); // 'asking' | 'granted' | 'denied' | 'ready'

  /* Interview flow state */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Timer state */
  const [secondsRemaining, setSecondsRemaining] = useState(QUESTION_TIME_SECS);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [timerExpired, setTimerExpired] = useState(false);

  /* Media state */
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(
    typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const [micError, setMicError] = useState('');
  const [cameraError, setCameraError] = useState(false);

  /* Proctoring state */
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);

  /* Refs */
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const synthRef = useRef(window.speechSynthesis);
  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);

  const currentQ = currentQuestions[currentIndex] || currentQuestions[0];
  const totalQuestions = currentQuestions.length;
  const typeMeta = TYPE_META[currentQ?.type] || TYPE_META.Technical;
  const TypeIcon = typeMeta.icon;

  /* ── Helpers ── */
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const saveProctorEvent = useCallback(
    (type, detail = '') => {
      const ev = recordProctoringEvent(type, detail);
      if (activeInterviewId) {
        apiSaveProctoringEvent(activeInterviewId, ev);
      }
    },
    [activeInterviewId, recordProctoringEvent]
  );

  /* ── Speech Recognition Check ── */
  useEffect(() => {
    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setSpeechSupported(Boolean(SR));
  }, []);

  /* ── Camera stream ── */
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(false);
    } catch {
      setCameraError(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  /* ── Permission gate handlers ── */
  const handlePermissionGranted = useCallback(async () => {
    setPermissionPhase('granted');
    await startCamera();
    setPermissionPhase('ready');
  }, [startCamera]);

  const handlePermissionDenied = useCallback(() => {
    setIsCameraOn(false);
    setPermissionPhase('ready');
  }, []);

  /* ── Speech Recognition (Web Speech API) ── */
  const stopSpeaking = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
    }
    setIsRecording(false);
  }, []);

  const startSpeaking = useCallback(async () => {
    setMicError('');

    const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setSpeechSupported(false);
      setMicError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge, or type your answer directly.');
      return;
    }

    // Explicitly request microphone permission
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release track immediately so Web Speech API has exclusive audio input
        audioStream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicError('Microphone permission was denied. Please allow microphone access in your browser to use speech-to-text, or type your answer directly.');
        } else {
          setMicError(`Microphone access error (${err.message || err.name}). You can continue by typing your answer.`);
        }
        setIsRecording(false);
        return;
      }
    }

    // Stop any previous running instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
    }

    // Capture base text before dictation starts so spoken English appends smoothly to typed text
    baseTextRef.current = answerText ? answerText.trim() + ' ' : '';

    try {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN'; // Default recognition language en-IN

      rec.onstart = () => {
        setIsRecording(true);
        setMicError('');
      };

      rec.onresult = (e) => {
        let sessionFinal = '';
        let sessionInterim = '';

        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) {
            sessionFinal += res[0].transcript + ' ';
          } else {
            sessionInterim += res[0].transcript;
          }
        }

        const combined = `${baseTextRef.current}${sessionFinal}${sessionInterim}`
          .replace(/\s+/g, ' ')
          .trimStart();

        setAnswerText(combined);
      };

      rec.onerror = (e) => {
        console.warn('SpeechRecognition error:', e.error);
        if (e.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Please allow microphone access in browser settings or type your answer below.');
          setIsRecording(false);
        } else if (e.error === 'audio-capture') {
          setMicError('No microphone detected. Please check your audio hardware or type your answer.');
          setIsRecording(false);
        } else if (e.error === 'no-speech') {
          // Normal silence, keep listening
        } else {
          setMicError(`Speech recognition notice: ${e.error}. You can also type your answer directly.`);
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setMicError('Could not start speech recognition. Please type your answer directly.');
      setIsRecording(false);
    }
  }, [answerText]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeaking();
      synthRef.current?.cancel();
      clearInterval(timerRef.current);
      clearInterval(totalTimerRef.current);
    };
  }, [stopCamera, stopSpeaking]);

  /* ── Camera toggle ── */
  useEffect(() => {
    if (permissionPhase !== 'ready') return;
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
      saveProctorEvent('camera_off', 'Candidate toggled off camera');
    }
  }, [isCameraOn, permissionPhase, startCamera, stopCamera, saveProctorEvent]);

  /* ── Tab visibility proctoring ── */
  useEffect(() => {
    if (permissionPhase !== 'ready') return;

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        setShowTabWarning(true);
        saveProctorEvent('tab_switch', `Switched away (occurrence ${newCount})`);
      } else {
        saveProctorEvent('tab_return', 'Returned to interview tab');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [permissionPhase, tabSwitchCount, saveProctorEvent]);

  /* ── Per-question countdown timer ── */
  useEffect(() => {
    if (permissionPhase !== 'ready') return;
    clearInterval(timerRef.current);
    setSecondsRemaining(QUESTION_TIME_SECS);
    setTimerExpired(false);

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, permissionPhase]);

  /* ── Total elapsed timer ── */
  useEffect(() => {
    if (permissionPhase !== 'ready') return;
    totalTimerRef.current = setInterval(() => setTotalElapsed((p) => p + 1), 1000);
    return () => clearInterval(totalTimerRef.current);
  }, [permissionPhase]);

  /* ── TTS: speak question on change ── */
  const speakQuestion = useCallback(
    (text) => {
      if (isVoiceMuted || !synthRef.current || !text) return;
      synthRef.current.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.onstart = () => setIsAiSpeaking(true);
      utter.onend = () => setIsAiSpeaking(false);
      utter.onerror = () => setIsAiSpeaking(false);
      const voices = synthRef.current.getVoices();
      const preferred = voices.find(
        (v) => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha'))
      );
      if (preferred) utter.voice = preferred;
      synthRef.current.speak(utter);
    },
    [isVoiceMuted]
  );

  useEffect(() => {
    if (permissionPhase !== 'ready') return;
    setShowHint(false);
    setMicError('');
    stopSpeaking();
    setAnswerText(userAnswers[currentQ?.id] || '');
    speakQuestion(currentQ?.question);
    return () => synthRef.current?.cancel();
  }, [currentIndex, permissionPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Navigation ── */
  const saveCurrentAnswer = () => {
    stopSpeaking();
    recordAnswer(currentQ.id, answerText);
    synthRef.current?.cancel();
  };

  const handleNext = () => {
    saveCurrentAnswer();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      saveCurrentAnswer();
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleFinish = async () => {
    saveCurrentAnswer();
    setIsSubmitting(true);
    stopCamera();
    synthRef.current?.cancel();
    clearInterval(timerRef.current);
    clearInterval(totalTimerRef.current);

    await completeInterview({
      duration: `${Math.floor(totalElapsed / 60)}m ${totalElapsed % 60}s`,
    });

    setIsSubmitting(false);
    navigate('/report');
  };

  /* ─── Render: permission gate ─────────────────────────────── */
  if (permissionPhase === 'asking') {
    return (
      <WebcamPermissionGate
        onGranted={handlePermissionGranted}
        onDenied={handlePermissionDenied}
      />
    );
  }

  if (permissionPhase === 'granted') {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] bg-[#070a14] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Initialising interview environment…</p>
        </div>
      </div>
    );
  }

  /* ─── Progress bar percentage ─── */
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const timerPct = Math.round((secondsRemaining / QUESTION_TIME_SECS) * 100);
  const timerColor =
    secondsRemaining > 90 ? 'bg-emerald-500' : secondsRemaining > 45 ? 'bg-amber-400' : 'bg-red-500';

  /* ─── Main render ─────────────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col bg-[#070a14] text-white">

      {/* Tab switch warning */}
      {showTabWarning && (
        <TabWarningBanner count={tabSwitchCount} onDismiss={() => setShowTabWarning(false)} />
      )}

      {/* ── Top Bar ── */}
      <div className="px-4 sm:px-6 py-3 bg-[#0b0f1d] border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        {/* Left: role + badges */}
        <div className="flex items-center gap-3 min-w-0">
          <Badge variant="purple" size="md">Live Round</Badge>
          <div className="hidden sm:block min-w-0">
            <h2 className="text-sm font-bold text-white truncate">
              {resumeData?.targetRole || 'Full Stack Engineer'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {currentQ?.difficulty || 'Intermediate'} Difficulty · AI Proctored
            </p>
          </div>
        </div>

        {/* Centre: overall progress */}
        <div className="flex-1 max-w-xs hidden md:block">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{progressPct}% complete</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Right: timer + tab alert + end */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {tabSwitchCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {tabSwitchCount} switch{tabSwitchCount > 1 ? 'es' : ''}
            </div>
          )}

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-colors ${secondsRemaining <= 45
              ? 'bg-red-500/15 border-red-500/40 text-red-300'
              : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(secondsRemaining)}
          </div>

          <Button size="sm" variant="danger" onClick={handleFinish} icon={Flag}>
            End
          </Button>
        </div>
      </div>

      {/* ── Timer Thin Bar ── */}
      <div className="h-1 bg-slate-900 w-full">
        <div
          className={`h-full ${timerColor} transition-all duration-1000`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* ── Timer expired nudge ── */}
      {timerExpired && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-300 text-center">
          Time's up for this question — wrap up your answer and proceed when ready.
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto w-full">

        {/* ── Left Column: Question Card (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col space-y-4">

          {/* AI Examiner Card */}
          <Card elevated className="p-4 bg-[#0d1326] border-purple-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-purple-500/30">
                    <div className="w-full h-full bg-[#0a0e1c] rounded-[13px] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  {isAiSpeaking && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0e1c] animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Gemini Examiner</h3>
                    <Badge variant={isAiSpeaking ? 'purple' : 'neutral'} size="sm">
                      {isAiSpeaking ? 'Speaking…' : 'Listening'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-500">AI Technical Bar · Speech Synthesis</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                  className={`p-2 rounded-xl transition-colors ${isVoiceMuted
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  title={isVoiceMuted ? 'Unmute' : 'Mute examiner'}
                >
                  {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
                </button>
                <button
                  onClick={() => speakQuestion(currentQ?.question)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Replay question aloud"
                >
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090d19] border border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 pl-1">
                {isAiSpeaking ? 'Voice stream active…' : 'Channel ready for candidate reply'}
              </span>
              <AudioWaveform isActive={isAiSpeaking} color="purple" count={14} />
            </div>
          </Card>

          {/* Question Display */}
          <Card className="p-5 flex-1 flex flex-col space-y-4 bg-[#0b1021]">
            {/* Type + Difficulty badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${typeMeta.bg} ${typeMeta.text}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {typeMeta.label}
              </div>
              <Badge variant={
                currentQ?.difficulty === 'Advanced' ? 'purple' :
                  currentQ?.difficulty === 'Beginner' ? 'cyan' : 'blue'
              } size="sm">
                {currentQ?.difficulty || 'Intermediate'}
              </Badge>
              <span className="ml-auto text-xs text-slate-500 font-mono">
                Q{currentIndex + 1} / {totalQuestions}
              </span>
            </div>

            {/* Question text */}
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Question {currentIndex + 1}
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                "{currentQ?.question}"
              </h2>
              {currentQ?.context && (
                <p className="mt-3 text-xs text-slate-400 italic border-l-2 border-slate-700 pl-3">
                  {currentQ.context}
                </p>
              )}
            </div>

            {/* Expected key points */}
            {currentQ?.expectedKeyPoints?.length > 0 && showHint && (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                <p className="text-xs font-semibold text-slate-300">Key areas to cover:</p>
                <ul className="space-y-1">
                  {currentQ.expectedKeyPoints.map((pt, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hint toggle */}
            <div className="border-t border-slate-800 pt-3">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHint ? 'Hide hint' : 'Show hint (no score impact)'}
              </button>
              {showHint && currentQ?.hint && (
                <div className="mt-2.5 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                  <p className="font-semibold text-purple-300">Examiner Hint:</p>
                  <p className="leading-relaxed">{currentQ.hint}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── Right Column: Webcam + Answer (5 cols) ── */}
        <div className="lg:col-span-5 flex flex-col space-y-4">

          {/* Webcam Box */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#0a0e1c] border border-slate-800 shadow-xl flex items-center justify-center">
            {isCameraOn && !cameraError ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600 space-y-2">
                <VideoOff className="w-8 h-8" />
                <span className="text-xs font-medium">
                  {cameraError ? 'Camera unavailable' : 'Camera paused'}
                </span>
              </div>
            )}

            {/* Candidate label overlay */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isRecording ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                }`} />
              {resumeData?.candidateName || 'Candidate'}
            </div>

            {/* Media controls overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
              <button
                onClick={() => setIsCameraOn((v) => !v)}
                className={`p-2 rounded-xl backdrop-blur-md border transition-colors ${isCameraOn
                    ? 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
                    : 'bg-rose-500/80 border-rose-600 text-white'
                  }`}
                title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={isRecording ? stopSpeaking : startSpeaking}
                className={`p-2 rounded-xl backdrop-blur-md border transition-colors ${isRecording
                    ? 'bg-red-500 border-red-600 text-white animate-pulse'
                    : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
                  }`}
                title={isRecording ? 'Stop Speaking' : 'Start Speaking'}
              >
                {isRecording ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/80 backdrop-blur-sm text-white text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                REC
              </div>
            )}
          </div>

          {/* Answer Workspace */}
          <Card elevated className="p-4 flex-1 flex flex-col space-y-3 bg-[#0c1122]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-purple-400" />
                Your Answer
                {speechSupported ? (
                  <Badge variant="cyan" size="sm">Speech-to-Text (en-IN)</Badge>
                ) : (
                  <Badge variant="slate" size="sm">Type Answer (STT Unsupported)</Badge>
                )}
              </label>
              <div className="flex items-center gap-2">
                {isRecording && (
                  <span className="flex items-center gap-1 text-[11px] text-red-400 font-semibold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Listening (en-IN)...
                  </span>
                )}
                <span className="text-[11px] text-slate-500 font-mono">
                  {answerText.trim() ? answerText.trim().split(/\s+/).length : 0} words
                </span>
              </div>
            </div>

            {/* Error message for microphone permission denied or unsupported */}
            {micError && (
              <div className="flex items-start justify-between gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <p className="font-medium">{micError}</p>
                    <p className="text-[11px] text-amber-400/80 mt-0.5">
                      Type Answer fallback is fully available below.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMicError('')}
                  className="p-1 text-amber-400/60 hover:text-amber-200 transition-colors"
                  title="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <textarea
              rows={6}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your answer here, or click 'Start Speaking' to dictate in English (en-IN)..."
              className="w-full flex-1 bg-[#070a14] border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none font-sans leading-relaxed transition-colors"
            />

            {/* Word count progress bar (target ~100 words) */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                <span>Response depth</span>
                <span>{Math.min(100, Math.round((answerText.trim().split(/\s+/).filter(Boolean).length / 100) * 100))}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (answerText.trim().split(/\s+/).filter(Boolean).length / 100) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Speech controls: Start Speaking / Stop Speaking + Clear */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={isRecording ? stopSpeaking : startSpeaking}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  isRecording
                    ? 'bg-red-500/20 border-red-500 text-red-300 hover:bg-red-500/30 animate-pulse shadow-lg shadow-red-500/10'
                    : 'bg-purple-600/20 border-purple-500/40 text-purple-200 hover:bg-purple-600/30 hover:border-purple-500'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 text-red-400" />
                    <span>Stop Speaking</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-purple-400" />
                    <span>Start Speaking</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setAnswerText('')}
                className="px-3 py-2.5 rounded-xl text-xs text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-400 transition-colors"
                title="Clear answer"
              >
                Clear
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                icon={ArrowLeft}
                className="flex-shrink-0"
              >
                Prev
              </Button>

              {currentIndex < totalQuestions - 1 ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleNext}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="flex-1"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="cyan"
                  onClick={handleFinish}
                  loading={isSubmitting}
                  icon={CheckCircle2}
                  iconPosition="right"
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting…' : 'Finish & View Report'}
                </Button>
              )}
            </div>
          </Card>

          {/* Question Dot Navigator */}
          <div className="flex items-center justify-center gap-2 py-1">
            {currentQuestions.map((q, i) => {
              const answered = !!userAnswers[q.id] || (i === currentIndex && answerText.trim().length > 0);
              const isCurrent = i === currentIndex;
              const qMeta = TYPE_META[q.type] || TYPE_META.Technical;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    saveCurrentAnswer();
                    setCurrentIndex(i);
                  }}
                  title={`Q${i + 1}: ${qMeta.label}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold border transition-all ${isCurrent
                      ? 'bg-purple-600 border-purple-500 text-white scale-110 shadow-md shadow-purple-500/30'
                      : answered
                        ? 'bg-slate-700 border-slate-600 text-slate-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
