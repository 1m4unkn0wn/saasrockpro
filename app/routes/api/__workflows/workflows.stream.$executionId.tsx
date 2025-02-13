// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import { emitter } from "~/utils/stream/emitter.server";
import { eventStream } from "~/utils/stream/event-stream";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let eventName = `workflowExecutionUpdate:${params.executionId}`;
  return eventStream(request.signal, (send) => {
    // listener handler
    const listener = (data: string) => {
      // data should be serialized
      send({ data });
    };

    // event listener itself
    emitter.on(eventName, listener);

    // cleanup
    return () => {
      emitter.off(eventName, listener);
    };
  });
};
