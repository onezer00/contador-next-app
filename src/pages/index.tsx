import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const [target, setTarget] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (target) {
      router.push(`/countdown?target=${encodeURIComponent(target)}&comment=${encodeURIComponent(comment)}`);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Contador de Tarefas</title>
        <meta name="description" content="Cronometre o tempo das suas tarefas de forma simples e moderna." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Contador Next</h1>
        <p className={styles.description}>
          Cronometre o tempo das suas tarefas de forma simples, moderna e personalizável.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <label htmlFor="target" style={{ fontSize: 18, marginBottom: 8 }}>Escolha a data e hora do seu objetivo:</label>
          <input
            id="target"
            type="datetime-local"
            value={target}
            onChange={e => setTarget(e.target.value)}
            style={{
              padding: '0.7rem 1rem',
              borderRadius: 8,
              border: '1px solid #00c9a7',
              fontSize: 18,
              background: '#23283b',
              color: '#eaeaea',
              outline: 'none',
              marginBottom: 8,
            }}
            required
          />
          <label htmlFor="comment" style={{ fontSize: 18, marginBottom: 8 }}>Comentário (opcional):</label>
          <input
            id="comment"
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, 100))}
            maxLength={100}
            placeholder="Ex: Reunião, estudo, tarefa..."
            style={{
              padding: '0.7rem 1rem',
              borderRadius: 8,
              border: '1px solid #00c9a7',
              fontSize: 18,
              background: '#23283b',
              color: '#eaeaea',
              outline: 'none',
              marginBottom: 16,
              width: 280,
            }}
          />
          <button className={styles.button} type="submit">
            Iniciar Contador
          </button>
        </form>
      </main>
    </div>
  );
} 