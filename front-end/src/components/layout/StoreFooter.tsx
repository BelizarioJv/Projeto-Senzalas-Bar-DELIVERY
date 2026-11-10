import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { storeNavigationLinks } from "./store-navigation";

export function StoreFooter() {
  return (
    <footer id="rodape" className="mt-12 bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <Image
            src="/LogoSenzalasBar.png"
            alt="SenzalasBar"
            width={140}
            height={41}
            className="h-10 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Bebidas selecionadas para pedir online e receber onde você estiver.
          </p>
        </div>

        <nav aria-label="Links do rodapé">
          <h2 className="mb-3 text-sm font-semibold">Navegação</h2>
          <ul className="space-y-1">
            {storeNavigationLinks
              .filter((link) => link.target !== "rodape")
              .map((link) => (
                <li key={link.target}>
                  <Link
                    href={`/home#${link.target}`}
                    className="inline-flex min-h-9 items-center text-sm text-white/70 transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link
                href="/carrinho"
                className="inline-flex min-h-9 items-center text-sm text-white/70 transition-colors hover:text-primary">
                Carrinho
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-sm font-semibold">Entrega</h2>
          <p className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="size-4 text-primary" />
            Santa Luzia e região
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} SenzalasBar. Todos os direitos reservados.
      </div>
    </footer>
  );
}
