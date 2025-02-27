"use client";

import {
  RepositoriesResponse,
  RepositoryNormalized,
} from "@/models/user-repos";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Repository from "@/components/Repository";

import { toast } from "sonner";

interface RepositoriesProps {
  reposUrl: string;
}

const Repositories = (props: RepositoriesProps) => {
  const { reposUrl } = props;
  const [loading, setLoading] = useState(false);
  const [repositories, setRepositories] = useState<RepositoryNormalized[]>([]);

  const mountRef = useRef(false);

  const handleGetRepository = useCallback(() => {
    setLoading(true);
    fetch(reposUrl, { next: { revalidate: 60 } })
      .then((res) => res.json())
      .then((res: RepositoriesResponse) => {
        const repos: RepositoryNormalized[] = res.map((repo) => ({
          id: repo.id,
          name: repo.name,
          stars: repo.stargazers_count,
          description: repo.description,
        }));

        setRepositories(repos);
        setLoading(false);
      })
      .catch(() => {
        toast("API rate limit exceeded, please try again later");
      })
      .finally(() => setLoading(false));
  }, [reposUrl]);

  useEffect(() => {
    if (mountRef.current) return;

    mountRef.current = true;

    handleGetRepository();
  }, [handleGetRepository]);

  if (loading) {
    return (
      <div className="ml-4 gap-2">
        <Repository name={""} stars={0} desc={""} loading={true} />
      </div>
    );
  }

  if (repositories.length === 0 && !loading) {
    return (
      <div className="ml-4 gap-2">
        <div>User does not have repository</div>
      </div>
    );
  }

  return (
    <div className="ml-4 gap-2">
      {repositories.map((repo) => (
        <Repository
          key={repo.id}
          name={repo.name}
          stars={repo.stars}
          desc={repo.description}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default Repositories;
