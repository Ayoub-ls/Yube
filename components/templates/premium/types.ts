import React from "react";

export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Stat {
  id: number;
  number: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image: string;
}

export interface AudioReview {
  id: number;
  name: string;
  avatar: string;
  city: string;
  duration: string;
  rating: number;
  transcript: string;
  date: string;
  url?: string;
}
