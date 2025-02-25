import { render } from "@solidjs/web";
import {
  createSignal,
  createAsync,
  createMemo,
  createEffect,
  isPending,
  Suspense,
  ErrorBoundary,
} from "solid-js";

function PhraseCounter() {
  console.log(`Rendering PhraseCounter`);

  const [count, setCount] = createSignal(0);
  const hello = createAsync(() => getHello());
  const phrase = createAsync(() => getPhrase(count()));
  const upperPhrase = createMemo(() => phrase().toUpperCase());

  createEffect(
    phrase,
    (phrase) => console.log({ phrase }),
    (err) => console.log("Oh no!", err)
  );

  return (
    <Suspense fallback={<p>Loading phrase counter...</p>}>
      <h1>{hello()}</h1>
      <button
        class="increment"
        onClick={() => setCount(count() + 1)}
        type="button"
        style={{ opacity: isPending(upperPhrase, false) ? 0.5 : 1 }}
      >
        Clicks: {count()}
      </button>
      <ErrorBoundary
        fallback={(err, reset) => {
          return (
            <>
              <p>Error message: {err.message}</p>
              <button onClick={reset}>Retry</button>
            </>
          );
        }}
      >
        <Suspense fallback={<p>Loading phrase...</p>}>
          <Message text={upperPhrase()} loading={isPending(upperPhrase)} />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}

function Message(props: { text: string, loading?: boolean }) {
  console.log(`Rendering <Message>`);
  return <p style={{opacity: props.loading ? 0.5 : 1}}>The message is: {props.text}</p>;
}

const phrases = [
  "Zero is the number of times I've given up.",
  "One is the number of times I've tried.",
  "Two is the number of times I've failed.",
  "Three is the number of times I've succeeded.",
  "Four is the number of times I've been lucky.",
  "Five is the number of times I've been unlucky.",
  "Six is the number of times I've been happy.",
  "Seven is the number of times I've been sad.",
  "Eight is the number of times I've been angry.",
  "Nine is the number of times I've been calm.",
];
async function getPhrase(num) {
  // generate a funny phrase for each number from 0 to 9
  console.log("Fetching phrase for", num);
  await new Promise((r) => setTimeout(r, 800));
  if (Math.random() < 0.3) {
    console.log(`getPhrase throwing`);
    throw new Error(`Random async error`);
  }
  return phrases[num];
}

async function getHello() {
  console.log("Fetching helloo...");
  await new Promise((r) => setTimeout(r, 500));
  // if (Math.random() < 0.5) {
  //   console.log(`getHello throwing`);
  //   throw new Error(`Random async error`);
  // }
  return "Hello world!";
}

render(
  () => (
    <ErrorBoundary
      fallback={(err, reset) => {
        return (
          <>
            <p>
              Something went wrong! <button onClick={reset}>Try Again</button>
            </p>
            <p>Error message: {err.message}</p>
          </>
        );
      }}
    >
      <main>
        <PhraseCounter />
      </main>
    </ErrorBoundary>
  ),
  document.getElementById("root")
);
