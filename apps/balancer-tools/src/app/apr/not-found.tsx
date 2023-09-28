import ErrorTemplate from "./(components)/ErrorTemplate";

export default function NotFound() {
  return (
    <ErrorTemplate
      title="404!"
      textContent="We can't find the page that you're looking for"
    />
  );
}
