import About from "~/app/_components/about";
import Head from "~/app/_components/head";
import Hero from "~/app/_components/hero";
import Services from "~/app/_components/services";

export default async function Home() {
  return (
    <>
      <Head title="Home" />
      <main>
        <Hero />
        <About />
        <Services />
      </main>
    </>
  );
}
