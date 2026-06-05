"use client";



import { useCallback, useEffect, useState } from "react";

import { highlightConditionText } from "@/lib/highlight-condition";

import { STEP_SUCCESS_MS } from "./step-advance";

import { StepSuccess } from "./StepSuccess";



interface ReadConditionStepProps {

  stepId?: string;

  title: string;

  condition: string;

  enableTts?: boolean;

  highlightVariant?: "heads-legs" | "dirichlet";

  onComplete: () => void;

}



export function ReadConditionStep({

  stepId,

  title,

  condition,

  enableTts = false,

  highlightVariant = "heads-legs",

  onComplete,

}: ReadConditionStepProps) {

  const [confirmed, setConfirmed] = useState(false);

  const [speaking, setSpeaking] = useState(false);



  useEffect(() => {

    setConfirmed(false);

    setSpeaking(false);

  }, [stepId]);



  useEffect(() => {

    if (!confirmed) return;

    const timer = window.setTimeout(onComplete, STEP_SUCCESS_MS);

    return () => window.clearTimeout(timer);

  }, [confirmed, onComplete]);



  useEffect(() => {

    return () => {

      if (typeof window !== "undefined" && window.speechSynthesis) {

        window.speechSynthesis.cancel();

      }

    };

  }, [stepId]);



  const speak = useCallback(() => {

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const text = `${title}. ${condition}`;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ru-RU";

    utterance.rate = 0.92;

    utterance.onstart = () => setSpeaking(true);

    utterance.onend = () => setSpeaking(false);

    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);

  }, [title, condition]);



  const stopSpeak = useCallback(() => {

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    setSpeaking(false);

  }, []);



  if (confirmed) {

    return <StepSuccess message="✅ Прочитал! Переходим к решению." />;

  }



  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;



  return (

    <div>

      <h3 className="mb-4 text-lg font-semibold">Прочитай задачу</h3>

      <p className="mb-4 text-sm text-gray-500">

        Числа и ключевые слова подсвечены — перенеси их на следующих шагах. На следующих экранах

        условие останется сверху.

      </p>

      <div className="mb-6 rounded-xl border border-lavender-200 bg-white p-6 shadow-sm">

        <h4 className="mb-3 text-lg font-semibold text-gray-900">{title}</h4>

        <p className="whitespace-pre-line text-base leading-relaxed text-gray-700">

          {highlightConditionText(condition, highlightVariant)}

        </p>

      </div>

      <div className="flex flex-wrap gap-3">

        {enableTts && ttsSupported ? (

          speaking ? (

            <button

              type="button"

              onClick={stopSpeak}

              className="rounded-xl border border-lavender-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700"

            >

              ⏹ Остановить озвучку

            </button>

          ) : (

            <button

              type="button"

              onClick={speak}

              className="rounded-xl border border-lavender-200 bg-lavender-50 px-5 py-2.5 text-sm font-medium text-brand-purple"

            >

              🔊 Прочитать вслух

            </button>

          )

        ) : null}

        <button

          type="button"

          onClick={() => {

            stopSpeak();

            setConfirmed(true);

          }}

          className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"

        >

          Прочитал, дальше

        </button>

      </div>

    </div>

  );

}

