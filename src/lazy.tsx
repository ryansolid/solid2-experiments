import { createAsync } from "solid-js";

export default function Component(props: { greeting: string }) {
  console.log("HELLO")
  const async = createAsync(() => new Promise((r) => setTimeout(r, 1000, "Lazy")));
  return <>{props.greeting} {async()}</>;
}