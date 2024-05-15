"use client";

import type { CardProps } from "@nextui-org/react";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Link,
  cn,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function Component(props: CardProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const content = isOpen ? (
    <div className="h-full w-full items-start justify-center overflow-scroll px-4 pb-24 pt-20">
      <div className="flex flex-col gap-2">
        <Input
          autoFocus
          fullWidth
          aria-label="Affiliate code"
          classNames={{
            inputWrapper: "group-data-[focus-visible=true]:outline-foreground",
          }}
          label="Enter affiliate code"
          labelPlacement="outside"
          placeholder="E.g. ACME123"
        />
        <Button className="mt-1">Submit</Button>
      </div>
      <Divider className="mb-8 mt-10" />
      <ul className="flex flex-col gap-1">
        <li>
          <Link className="text-default-400" href="#" size="sm">
            Where do I find my affiliate code?
          </Link>
        </li>
        <li>
          <Link className="text-default-400" href="#" size="sm">
            How do I become an affiliate?
          </Link>
        </li>
        <li>
          <Link className="text-default-400" href="#" size="sm">
            What are the benefits of being an affiliate?
          </Link>
        </li>
        <li>
          <Link className="text-default-400" href="#" size="sm">
            Contact Acme Support
          </Link>
        </li>
      </ul>
    </div>
  ) : (
    <ul>
      <li className="flex items-center gap-1">
        <Icon className="text-default-600" icon="ci:dot-01-xs" width={24} />
        <p className="text-small text-default-500">New Acme customer</p>
      </li>
      <li className="flex items-center gap-1">
        <Icon className="text-default-600" icon="ci:dot-01-xs" width={24} />
        <p className="text-small text-default-500">Fewer than 10 employees</p>
      </li>
      <li className="flex items-center gap-1">
        <Icon className="text-default-600" icon="ci:dot-01-xs" width={24} />
        <p className="text-small text-default-500">
          Affiliated with an Acme partner
        </p>
      </li>
    </ul>
  );

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_) => {
        return (
          <Card key={_} {...props} className="relative w-full pb-[120px]">
            <Button
              className="absolute right-4 top-8 z-10"
              isIconOnly={isOpen}
              radius="full"
              size="sm"
              onPress={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <Icon icon="ci:close-sm" width={24} /> : "Apply"}
            </Button>
            <CardBody className="relative min-h-[300px] bg-gradient-to-br from-content1 to-default-100/50 p-8 before:inset-0 before:h-full before:w-full before:content-['']">
              <h1 className="mb-4 text-default-400">Get up to</h1>
              <h2 className="inline bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text text-6xl font-semibold tracking-tight text-transparent dark:to-foreground-200">
                Four
                <br />
                months
                <br />
                free
              </h2>
            </CardBody>
            <CardFooter
              className={cn(
                "absolute bottom-0 h-[120px] overflow-visible bg-content1 px-6 duration-300 ease-in-out transition-height",
                {
                  "h-full": isOpen,
                  "border-t-1 border-default-100": !isOpen,
                }
              )}
            >
              {content}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
