import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Contador from './countdown'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contador</title>
        <meta name="description" content="Contador utilitário com next.js app" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <Contador timeTillDate="05 26 2019, 6:00 am" timeFormat="MM DD YYYY, h:mm a" />
        </h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '} Oner
          <span className={styles.logo}>
          </span>
        </a>
      </footer>
    </div>
  )
}
