export default function cn(...classNames: string[]) {
  return classNames.filter((x) => !!x).join(' ');
}
