import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

export function Footer({
  githubLink,
  discordLink,
}: {
  githubLink: string;
  discordLink: string;
}) {
  return (
    <footer className="mt-auto flex h-14 border-t border-gray-700 bg-gray-800 px-6 py-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-300 sm:text-center">
        Proudly powered by{" "}
        <a
          target="_blank"
          href="https://github.com/bleu-studio"
          className="font-bold text-blue-500"
        >
          Bleu Studio
        </a>{" "}
        through Balancer Grants
      </span>
      <div className="mt-4 flex space-x-6 sm:justify-center md:mt-0">
        {githubLink && (
          <a
            target="_blank"
            href={githubLink}
            className="text-gray-300 hover:text-white"
          >
            <GitHubLogoIcon width={30} height={30} />
            <span className="sr-only">GitHub account</span>
          </a>
        )}
        {discordLink && (
          <a
            target="_blank"
            href={discordLink}
            className="text-gray-300 hover:text-white"
          >
            <DiscordLogoIcon width={30} height={30} />
            <span className="sr-only">GitHub account</span>
          </a>
        )}
      </div>
    </footer>
  );
}
