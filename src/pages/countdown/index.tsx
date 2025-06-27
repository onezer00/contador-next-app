import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, isBefore } from 'date-fns';
import styles from './style.module.scss';

interface CountdownProps {
  targetDate?: string; // ISO string ou data no formato 'yyyy-MM-ddTHH:mm:ss'
}

const getTimeLeft = (target: Date | null) => {
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const now = new Date();
  if (isBefore(target, now)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = differenceInSeconds(target, now);
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const minutes = differenceInMinutes(target, now) % 60;
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
};

const mapNumber = (number: number, in_min: number, in_max: number, out_min: number, out_max: number) => {
  return ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const SVGCircle = ({ radius }: { radius: number }) => (
  <svg className={styles['countdown-svg']}>
    <path
      fill="none"
      stroke="#00c9a7"
      strokeWidth={4}
      d={describeArc(60, 60, 54, 0, radius)}
    />
  </svg>
);

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
  return d;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const router = useRouter();
  const [alarm, setAlarm] = useState(false);
  const [played, setPlayed] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pega o parâmetro da query string
  const queryTarget = typeof window !== 'undefined' && router.query.target ? String(router.query.target) : undefined;
  const comment = typeof window !== 'undefined' && router.query.comment ? String(router.query.comment) : '';
  const target = queryTarget ? new Date(queryTarget) : null;

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    if (!target) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [queryTarget]);

  useEffect(() => {
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && target && !played) {
      setAlarm(true);
      setPlayed(true);
    }
  }, [timeLeft, target, played]);

  useEffect(() => {
    if (alarm) {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audioRef.current.loop = true;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [alarm]);

  const handleStopAlarm = () => {
    setAlarm(false);
    setShowReturn(true);
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  const daysRadius = mapNumber(timeLeft.days, 30, 0, 0, 360);
  const hoursRadius = mapNumber(timeLeft.hours, 24, 0, 0, 360);
  const minutesRadius = mapNumber(timeLeft.minutes, 60, 0, 0, 360);
  const secondsRadius = mapNumber(timeLeft.seconds, 60, 0, 0, 360);

  return (
    <div className={styles['countdown-container']}>
      {comment && (
        <div style={{ color: '#00c9a7', fontWeight: 'bold', fontSize: 28, marginBottom: 16, textAlign: 'center', textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
          {comment}
        </div>
      )}
      <h1 className={styles['countdown-title']}>Countdown</h1>
      <div className={styles['countdown-wrapper']}>
        <div className={styles['countdown-item']} style={alarm ? { boxShadow: '0 0 32px 8px #00c9a7', border: '2px solid #00c9a7' } : {}}>
          <SVGCircle radius={daysRadius} />
          <div className={styles['countdown-content']}>
            <div className={styles['countdown-value']}>{timeLeft.days}</div>
            <span className={styles['countdown-label']}>dias</span>
          </div>
        </div>
        <div className={styles['countdown-item']} style={alarm ? { boxShadow: '0 0 32px 8px #00c9a7', border: '2px solid #00c9a7' } : {}}>
          <SVGCircle radius={hoursRadius} />
          <div className={styles['countdown-content']}>
            <div className={styles['countdown-value']}>{timeLeft.hours}</div>
            <span className={styles['countdown-label']}>horas</span>
          </div>
        </div>
        <div className={styles['countdown-item']} style={alarm ? { boxShadow: '0 0 32px 8px #00c9a7', border: '2px solid #00c9a7' } : {}}>
          <SVGCircle radius={minutesRadius} />
          <div className={styles['countdown-content']}>
            <div className={styles['countdown-value']}>{timeLeft.minutes}</div>
            <span className={styles['countdown-label']}>minutos</span>
          </div>
        </div>
        <div className={styles['countdown-item']} style={alarm ? { boxShadow: '0 0 32px 8px #00c9a7', border: '2px solid #00c9a7' } : {}}>
          <SVGCircle radius={secondsRadius} />
          <div className={styles['countdown-content']}>
            <div className={styles['countdown-value']}>{timeLeft.seconds}</div>
            <span className={styles['countdown-label']}>segundos</span>
          </div>
        </div>
      </div>
      {alarm && (
        <div style={{ color: '#00c9a7', fontWeight: 'bold', fontSize: 24, marginTop: 32, textAlign: 'center' }}>
          Tempo esgotado!<br />
          <button onClick={handleStopAlarm} style={{
            marginTop: 16,
            background: '#00c9a7',
            color: '#181c25',
            border: 'none',
            borderRadius: 8,
            padding: '0.7rem 2rem',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            transition: 'background 0.2s, color 0.2s, transform 0.2s',
          }}>
            Parar Alarme
          </button>
        </div>
      )}
      {showReturn && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={handleReturnHome} style={{
            background: '#23283b',
            color: '#00c9a7',
            border: 'none',
            borderRadius: 8,
            padding: '0.7rem 2rem',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            transition: 'background 0.2s, color 0.2s, transform 0.2s',
          }}>
            Voltar para tela inicial
          </button>
        </div>
      )}
    </div>
  );
} 