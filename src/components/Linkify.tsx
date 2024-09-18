import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./UserLinkWithTooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

const Linkify = ({ children }: LinkifyProps) => {
  return (
    <LinkifyUsername>
      <LinkifyHashTags>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashTags>
    </LinkifyUsername>
  );
};

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

const LinkifyUsername = ({ children }: LinkifyProps) => {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkWithTooltip key={key} username={username}>
            <span className="text-primary hover:underline">{match}</span>
          </UserLinkWithTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
};
const LinkifyHashTags = ({ children }: LinkifyProps) => {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {" "}
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
};

export default Linkify;
