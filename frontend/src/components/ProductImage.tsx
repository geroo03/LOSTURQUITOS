interface Props {
  src?: string;
  alt: string;
  className?: string;
}

/** Foto del producto o, si todavía no tiene, un placeholder con el mismo tamaño. */
export function ProductImage({ src, alt, className = '' }: Props) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center text-[#49645c]/50 bg-[#faedcd] ${className}`}>
        <span className="material-symbols-outlined text-[32px]">image</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}
