import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ACM FEUP",
  description:
    "Learn more about ACM FEUP and find out everything about our goals, activities and community!",
};

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>
        The ACM (Association for Computing Machinery) was founded in 1947, and
        is today the largest scientific and educational computing society. The
        student chapter aims to have a representation of this society in the
        FEUP community with numerous workshops and various activities.
      </p>
      <br />
      <br />
      <section>
        <h2>Our History</h2>
        <br />
        <div>
          <article>
            <h3>[Foundation]</h3>
            <h4>1995 - 1999</h4>
            <p>
              Founded by second-year LEIC students: Sérgio Carvalho (President),
              André Restivo (Vice-President), and Nuno Lopes (Treasurer). André
              Restivo is now a professor at DEI and a mentor to the chapter.
            </p>
          </article>
          <br />
          <article>
            <h3>[First Era]</h3>
            <h4>2000 - 2008</h4>
            <p>
              Eight academic years with documented leadership teams and a strong
              sense of continuity. The leadership team brought together students
              from Computer Science and Electrical Engineering. Filipe Carvalho
              served on the board for six consecutive years: three as
              Vice-President and three as President.
            </p>
          </article>
          <br />
          <article>
            <h3>[Hiatus]</h3>
            <h4>2008 - 2020</h4>
            <p>No information is available for these years.</p>
          </article>
          <br />
          <article>
            <h3>[A New Era]</h3>
            <h4>2020 - 2025</h4>
            <p>
              The chapter resumed activity in 2020/2021 with Afonso Ramos as
              Chair. Filipe Correia served two consecutive terms as President,
              in 2023/2024 and 2024/2025. His board acknowledged that the
              chapter had struggled to remain active and reorganised it around a
              decentralised structure. In 2024/2025, the General Assembly and
              the Fiscal Board appeared for the first time.
            </p>
          </article>
          <br />
          <article>
            <h3>[Currently]</h3>
            <h4>2025 - 2027</h4>
            <p>
              Daniel Sousa served as President in 2025/2026, with Rafael Pinho e
              Silva as Vice-President. Rafael Pinho e Silva is currently serving
              as President for 2026/2027, leading a team that brings together
              students from LEIC and Economics.
            </p>
          </article>
          <br />
          <p>
            Over the years, our chapter has developed a wide range of
            applications for the FEUP community and participated in numerous
            competitions.
          </p>
        </div>
      </section>
    </main>
  );
}
