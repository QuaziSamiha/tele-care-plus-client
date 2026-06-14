import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICustomTabGroup } from "@/types/share-component.type";

export default function CustomTabGroup({
  defaultTab,
  tabList,
  tabContent,
}: ICustomTabGroup) {
  return (
    <div className="flex flex-col gap-12 w-full">
      <Tabs
        defaultValue={defaultTab}
        className="flex items-start justify-start"
      >
        <TabsList className="flex items-center justify-center md:gap-2 w-fit">
          {tabList.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab.value}
              className="pr-1.5 text-base font-semibold text-slate-700 cursor-pointer data-[state=active]:text-slate-800 data-[state=active]:underline data-[state=active]:underline-offset-4"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabContent.map((tab, index) => (
          <TabsContent key={index} value={tab.value} className="w-full mt-4">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
