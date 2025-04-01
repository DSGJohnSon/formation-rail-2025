import { Button } from "./ui/button";

export default function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant={"default"}
      size={"lg"}
      className="mt-4"
    >
      Passer à la question suivante
    </Button>
  );
}
