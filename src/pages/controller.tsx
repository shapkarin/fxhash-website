import type { NextPage } from "next"
import { useRef, useContext, useEffect } from "react"
import { Spacing } from "../components/Layout/Spacing"
import { SectionHeader } from "../components/Layout/SectionHeader"
import Head from "next/head"
import { SectionTitle } from "../components/Layout/SectionTitle"
import { useParams } from "../context/Params"
import { InputParams } from "tweakpane"

interface Props {
  params: InputParams
}

const ControllerPage: NextPage<Props> = ({ params }) => {
  const ref = useRef(null)

  const controller = useParams(params)

  console.log(controller)

  const handleReset = () => {
    controller.setParam("factor", 1000)
  }
  return (
    <>
      <Head>
        <title>fxhash — sandbox</title>
        <meta key="og:title" property="og:title" content="fxhash — sandbox" />
        <meta
          key="description"
          name="description"
          content="Experiment and test your Generative Tokens in the Sandbox environment"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Experiment and test your Generative Tokens in the Sandbox environment"
        />
      </Head>

      <Spacing size="6x-large" sm="3x-large" />

      <section>
        <SectionHeader>
          <SectionTitle>Controller</SectionTitle>
        </SectionHeader>
        <div ref={ref} id="someContainer" />
      </section>
      {controller.factor}
      <button onClick={handleReset}>set factor 1000</button>
      <Spacing size="6x-large" sm="5x-large" />
      <Spacing size="6x-large" sm="none" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      params: {
        factor: 123,
        title: "hello",
        color: 0xff0055,
      },
    },
  }
}

export default ControllerPage
