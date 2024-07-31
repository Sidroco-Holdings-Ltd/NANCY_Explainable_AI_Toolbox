"use client";
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <ECommerce />
        </Suspense>
      </DefaultLayout>
    </>
  );
}
