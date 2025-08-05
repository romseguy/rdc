import { useSelector } from "react-redux";
import { getState } from "~/store";

export function Home(props) {
  const { loaderData } = props;
  const { isMobile, lib = loaderData.lib, locale } = useSelector(getState);
  return (
    <div
      id="home-page"
      css={isMobile ? { padding: "12px" } : { padding: "48px" }}
    >
      {locale === "en" ? (
        <>
          In reality, acquiring self-consciousness means long and hard work. How
          can a man agree to this work if he thinks he already possesses the
          very thing which is promised him as the result of long and hard work?
          Naturally a man will not begin this work and will not consider it
          necessary until he becomes convinced that he possesses neither
          self-consciousness nor all that is connected with it, that is, unity
          or individuality, permanent 'I' and will. -- p.44{" "}
          <i>The psychology of Man's possible evolution</i> OUSPENSKY
        </>
      ) : (
        <>
          En réalité, l'acquisition de la conscience de soi nécessite un travail
          dur et prolongé. Comment un Homme accepterait-il de se plier à ce
          travail s'il estime posséder déjà cette chose même qu'on lui promet
          comme résultat d'un travail long et difficile ? Naturellement, cet
          Homme n'entreprendra pas ce travail, ni même n'en éprouvera-t-il la
          nécessité, avant d'être convaincu qu'il ne possède ni la conscience de
          soi ni tout ce qui s'y rapporte, à savoir l'unité intérieure ou
          individualité, un Moi permanent et la volonté. -- p.44{" "}
          <i>L'évolution possible de l'Homme</i> OUSPENSKY
        </>
      )}
      {/*<ul>
        <li>
          <b>{localize("Auteur", "Author")} : </b>
          <Link href={lib.author_url || "#"} target="_blank">
            {lib?.author || localize("Anonyme", "Anonymous")}
          </Link>
        </li>
      </ul>*/}
    </div>
  );
}
