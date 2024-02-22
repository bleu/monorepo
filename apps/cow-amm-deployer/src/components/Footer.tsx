import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export function Footer({
  githubLink,
  discordLink,
}: {
  githubLink: string;
  discordLink: string;
}) {
  return (
    <footer className="flex w-full justify-between bg-blue2 p-4">
      <span className="text-sm text-slate12/90">
        developed by&nbsp;
        <a
          target="_blank"
          href="https://github.com/bleu-fi"
          className="font-bold text-blue8"
        >
          bleu
        </a>
      </span>
      <div className="float-right flex flex-row items-center space-x-4">
        {githubLink && (
          <a target="_blank" href={githubLink} className="text-slate12/90">
            <GitHubLogoIcon width={20} height={20} />
            <span className="sr-only">GitHub account</span>
          </a>
        )}
        {discordLink && (
          <a target="_blank" href={discordLink} className="text-slate12/90">
            <DiscordLogoIcon width={20} height={20} />
            <span className="sr-only">Discord account</span>
          </a>
        )}
      </div>
    </footer>
  );
}
