import type {GetStaticPropsContext, GetStaticPropsResult, NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import {loadContent, PostModel, WorkModel} from "../util/content";

type HomeProps = {
  posts: Array<PostModel>,
  work: Array<WorkModel>
}

const Home: NextPage<HomeProps> = ({posts, work}: HomeProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&display=swap"
            rel="stylesheet" />
      </Head>

      <main className={styles.main}>
          <h1 className={styles.title} >Typerror, <span className={styles.lightTitle} >2021</span></h1>
          <h2 className={styles.title} >A.Vedi <span className={styles.lightTitle} >2021</span></h2>
        <ul>
          {posts.map(p => (
              <li key={p.meta.slug}>
                <a href={p.link}>
                  {p.meta.title}
                </a>
              </li>
          ))}
        </ul>
        <ul>
          {work.map(w => (
              <li key={w.meta.slug}>
                <a href={w.link}>
                  {w.meta.title}
                </a>
              </li>
          ))}
        </ul>

      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> {
  const {posts, work} = loadContent()

  return {
    props: {
      posts,
      work
    }
  }
}