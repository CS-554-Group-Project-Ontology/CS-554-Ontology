import { useEffect, useState } from "react";
import { z } from "zod";

interface EventStreamConfig<KafkaLayerData, ReactShapeData> {
  url: string;
  events: {
    snapshot: string;
    update: string;
  };
  schema: z.ZodType<KafkaLayerData>;
  transform: (item: KafkaLayerData) => ReactShapeData;
  getId: (item: ReactShapeData) => string;
  max?: number;
}

export function useEventStream<KafkaLayerData, ReactShapeData>({
  url,
  events,
  schema,
  transform,
  getId,
  max = 65,
}: EventStreamConfig<KafkaLayerData, ReactShapeData>): ReactShapeData[] {
  const [items, setItems] = useState<ReactShapeData[]>([]);

  useEffect(() => {
    const source = new EventSource(url);

    const onSnapshot = (e: MessageEvent<string>) => {
      let raw: unknown;
      
      try {
        raw = JSON.parse(e.data);
      } 

      catch (error) {
        console.error(`The SSE snapshot is invalid JSON on ${url}`, error);
        return;
      }

      const result = schema.array().safeParse(raw);

      if (!result.success) {

        console.error(`SSE snapshot: schema validation failed on ${url}`, result.error);

        return;
      }

      const seen = new Set<string>();

      const deduped: ReactShapeData[] = [];

      for (const piece of result.data) {
        const item = transform(piece);
        const id = getId(item);

        if (seen.has(id)) {
          continue;
        }

        seen.add(id);
        deduped.push(item);
      }
      setItems(deduped);
    };

    const onUpdate = (e: MessageEvent<string>) => {
      let raw: unknown;
      try {
        raw = JSON.parse(e.data);
      } 
      catch (error) {
        console.error(`SSE update: invalid JSON on ${url}`, error);
        return;
      }

      const result = schema.safeParse(raw);

      if (!result.success) {
        console.error(`SSE update schema validation failed on the given url:  ${url}`, result.error);
        return;
      }

      const item = transform(result.data);
      const id = getId(item);

      setItems((prev) => [item, ...prev.filter((p) => getId(p) !== id)].slice(0, max));
    };

    source.addEventListener(events.snapshot, onSnapshot as EventListener);
    source.addEventListener(events.update, onUpdate as EventListener);

    return () => {
      source.removeEventListener(events.snapshot, onSnapshot as EventListener);
      source.removeEventListener(events.update, onUpdate as EventListener);
      source.close();
    };
  }, [url, events.snapshot, events.update, schema, transform, getId, max]);

  return items;
}
