import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const _genre = [
  "诗",
  "词",
  "曲",
  "赋",
  "骈文",
  "诗经",
  "古文",
  "现代诗",
  "乐府", // 汉乐府、歌诗
];

/**
 * 选择体裁
 * @param param0
 * @returns
 */
export const GenreSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: string) => void;
}) => {
  return (
    <>
      <label className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        体裁
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择体裁" />
        </SelectTrigger>
        <SelectContent>
          {_genre.map((item) => (
            <SelectItem value={item} key={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
