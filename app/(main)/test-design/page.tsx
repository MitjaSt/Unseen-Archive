"use client";

import { Button } from 'primereact/button';

export default function TestDesign() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-coffee-bean border-b-2 border-scarlet-fire pb-2">Test Design</h1>

      <div className="space-y-8">
        {/* Color Palette Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-coffee-bean">Color Palette</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-coffee-bean rounded shadow-md"></div>
              <span className="mt-2 text-sm font-medium">Coffee Bean</span>
              <span className="text-xs text-gray-500">#0d0106</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-vivid-royal rounded shadow-md"></div>
              <span className="mt-2 text-sm font-medium">Vivid Royal</span>
              <span className="text-xs text-gray-500">#3626a7</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-glaucous rounded shadow-md"></div>
              <span className="mt-2 text-sm font-medium">Glaucous</span>
              <span className="text-xs text-gray-500">#657ed4</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-scarlet-fire rounded shadow-md"></div>
              <span className="mt-2 text-sm font-medium">Scarlet Fire</span>
              <span className="text-xs text-gray-500">#ff331f</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-ghost-white rounded shadow-md border border-gray-300"></div>
              <span className="mt-2 text-sm font-medium">Ghost White</span>
              <span className="text-xs text-gray-500">#fbfbff</span>
            </div>
          </div>
        </section>

        {/* Custom Colored Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-coffee-bean">Custom Colored Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              label="Coffee Bean"
              className="!bg-coffee-bean !border-coffee-bean hover:!bg-opacity-80"
            />
            <Button
              label="Vivid Royal"
              className="!bg-vivid-royal !border-vivid-royal hover:!bg-opacity-80"
            />
            <Button
              label="Glaucous"
              className="!bg-glaucous !border-glaucous hover:!bg-opacity-80"
            />
            <Button
              label="Scarlet Fire"
              className="!bg-scarlet-fire !border-scarlet-fire hover:!bg-opacity-80"
            />
            <Button
              label="Ghost White"
              className="!bg-ghost-white !border-ghost-white !text-coffee-bean hover:!bg-opacity-80"
            />
          </div>
        </section>

        {/* Outlined Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-coffee-bean">Outlined Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              label="Coffee Bean"
              outlined
              className="!border-coffee-bean !text-coffee-bean hover:!bg-coffee-bean hover:!text-white"
            />
            <Button
              label="Vivid Royal"
              outlined
              className="!border-vivid-royal !text-vivid-royal hover:!bg-vivid-royal hover:!text-white"
            />
            <Button
              label="Glaucous"
              outlined
              className="!border-glaucous !text-glaucous hover:!bg-glaucous hover:!text-white"
            />
            <Button
              label="Scarlet Fire"
              outlined
              className="!border-scarlet-fire !text-scarlet-fire hover:!bg-scarlet-fire hover:!text-white"
            />
          </div>
        </section>

        {/* Text Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-coffee-bean">Text Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              label="Coffee Bean"
              text
              className="!text-coffee-bean hover:!bg-coffee-bean hover:!bg-opacity-10"
            />
            <Button
              label="Vivid Royal"
              text
              className="!text-vivid-royal hover:!bg-vivid-royal hover:!bg-opacity-10"
            />
            <Button
              label="Glaucous"
              text
              className="!text-glaucous hover:!bg-glaucous hover:!bg-opacity-10"
            />
            <Button
              label="Scarlet Fire"
              text
              className="!text-scarlet-fire hover:!bg-scarlet-fire hover:!bg-opacity-10"
            />
          </div>
        </section>

        {/* Buttons with Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-coffee-bean">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              label="Coffee Bean"
              icon="pi pi-check"
              className="!bg-coffee-bean !border-coffee-bean hover:!bg-opacity-80"
            />
            <Button
              label="Vivid Royal"
              icon="pi pi-star"
              className="!bg-vivid-royal !border-vivid-royal hover:!bg-opacity-80"
            />
            <Button
              label="Glaucous"
              icon="pi pi-heart"
              className="!bg-glaucous !border-glaucous hover:!bg-opacity-80"
            />
            <Button
              label="Scarlet Fire"
              icon="pi pi-times"
              className="!bg-scarlet-fire !border-scarlet-fire hover:!bg-opacity-80"
            />
          </div>
        </section>

        {/* Rounded Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-coffee-bean">Rounded Icon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              icon="pi pi-check"
              rounded
              className="!bg-coffee-bean !border-coffee-bean hover:!bg-opacity-80"
              aria-label="Coffee Bean"
            />
            <Button
              icon="pi pi-star"
              rounded
              className="!bg-vivid-royal !border-vivid-royal hover:!bg-opacity-80"
              aria-label="Vivid Royal"
            />
            <Button
              icon="pi pi-heart"
              rounded
              className="!bg-glaucous !border-glaucous hover:!bg-opacity-80"
              aria-label="Glaucous"
            />
            <Button
              icon="pi pi-times"
              rounded
              className="!bg-scarlet-fire !border-scarlet-fire hover:!bg-opacity-80"
              aria-label="Scarlet Fire"
            />
          </div>
        </section>

        {/* Button Sizes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-coffee-bean">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              label="Small"
              size="small"
              className="!bg-vivid-royal !border-vivid-royal hover:!bg-opacity-80"
            />
            <Button
              label="Normal"
              className="!bg-vivid-royal !border-vivid-royal hover:!bg-opacity-80"
            />
            <Button
              label="Large"
              size="large"
              className="!bg-vivid-royal !border-vivid-royal hover:!bg-opacity-80"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
