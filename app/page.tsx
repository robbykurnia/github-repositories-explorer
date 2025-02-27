"use client";

import { useState } from "react";

import type { ChangeEvent, KeyboardEvent } from "react";

import InfiniteScroll from "@/components/InfiniteScroll";
import Repositories from "@/components/Repositories";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { toast } from "sonner";

import {
  GitHubUserNormalized,
  SearchUserNomralized,
  SearchUserResponse,
} from "@/models/search-user";

export default function Home() {
  const perPage = 10;
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState("");
  const [searchResult, setSearchResult] = useState<SearchUserNomralized>({
    keyword: "",
    totalCount: 0,
    totalPage: 0,
    users: [],
    hasSearch: false,
  });

  const hasMore = searchResult.totalPage > page;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setForm(value);
  };

  const handleSubmit = () => {
    if (!form) return;

    setLoading(true);
    fetch(
      `https://api.github.com/search/users?q=${form}&per_page=${perPage}&page=1`
    )
      .then((res) => res.json())
      .then((res: SearchUserResponse) => {
        const users: GitHubUserNormalized[] = res.items.map(
          ({ login, repos_url, id }) => ({
            id,
            name: login,
            reposUrl: repos_url,
          })
        );
        const result: SearchUserNomralized = {
          totalPage: Math.ceil(res.total_count / perPage),
          users,
          totalCount: res.total_count,
          hasSearch: true,
          keyword: form,
        };

        setSearchResult(result);
      })
      .catch(() => {
        toast("API rate limit exceeded, please try again later");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePagination = () => {
    setLoadMore(true);
    fetch(
      `https://api.github.com/search/users?q=${form}&per_page=${perPage}&page=${
        page + 1
      }`
    )
      .then((res) => res.json())
      .then((res: SearchUserResponse) => {
        const users: GitHubUserNormalized[] = res.items.map(
          ({ login, repos_url, id }) => ({
            id,
            name: login,
            reposUrl: repos_url,
          })
        );

        setSearchResult((prev) => ({
          ...prev,
          users: [...prev.users, ...users],
        }));
        setPage((prev) => prev + 1);
      })
      .catch(() => {
        toast("API rate limit exceeded, please try again later");
      })
      .finally(() => {
        setLoadMore(false);
      });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Enter Username"
        value={form}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Button
        className="w-full my-4 bg-blue-400 hover:bg-blue-400/90"
        disabled={loading}
        onClick={handleSubmit}
      >
        Search
      </Button>

      {searchResult.totalCount > 0 && (
        <div className="mb-2">
          Showing users for &quot;{searchResult.keyword}&quot;
        </div>
      )}

      {searchResult.totalCount === 0 && searchResult.hasSearch && (
        <div className="mb-2">
          Username &quot;{searchResult.keyword}&quot; not found
        </div>
      )}

      <Accordion type="single" collapsible className="w-full">
        {searchResult.users.map((user) => (
          <AccordionItem key={user.id} value={`${user.id}`} className="mb-2">
            <AccordionTrigger className="bg-gray-100">
              <div>{user.name}</div>
            </AccordionTrigger>
            <AccordionContent>
              <Repositories reposUrl={user.reposUrl} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {loadMore && <Skeleton className="h-9 w-100 rounded-none" />}
      {!loading && !loadMore && (
        <InfiniteScroll
          loadMore={handlePagination}
          hasMore={hasMore}
          threshold={300}
        />
      )}
      <Toaster />
    </div>
  );
}
