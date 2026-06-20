import { useCallback, useEffect, useState } from 'react';

export interface PedidoLine {
  id: string;
  name: string;
  modo: 'unidad' | 'caja';
  precio: number;
  cantidad: number;
}

type AddInput = Omit<PedidoLine, 'cantidad'>;

const KEY = 'hdo.pedido.v1';
const lineKey = (id: string, modo: string) => `${id}__${modo}`;

export function usePedido() {
  const [lines, setLines] = useState<PedidoLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]') as PedidoLine[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((input: AddInput) => {
    setLines((prev) => {
      const i = prev.findIndex(
        (l) => lineKey(l.id, l.modo) === lineKey(input.id, input.modo),
      );
      if (i === -1) return [...prev, { ...input, cantidad: 1 }];
      const next = [...prev];
      next[i] = { ...next[i], cantidad: next[i].cantidad + 1 };
      return next;
    });
  }, []);

  const remove = useCallback((id: string, modo: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l.id, l.modo) !== lineKey(id, modo)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((s, l) => s + l.cantidad, 0);

  return { lines, add, remove, clear, count };
}
