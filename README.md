# LDS Temple Progress Tracker

## 1. Project Description
This website is a temple tracking platform inspired by churchofjesuschristtemples.org. It gives members and casual users a single place to see the current status of every temple around the world, whether it is announced, under construction, or fully dedicated. 

The core feature of the app is a community-driven progress feed. Users can take and upload their own recent photos of temples currently under construction, creating a visual timeline so everyone can watch the building progress over time.

## 2. User Roles

* **Guest / Public User**
  * Can browse all temples and filter them by status (announced, building, dedicated).
  * Can view the photo progress galleries for each temple.

* **Registered User**
  * Has all guest abilities.
  * Can upload recent construction photos to a specific temple's progress feed.

* **Admin**
  * Full access to the backend dashboard.
  * Can add new temples, change temple statuses, and update site details.
  * Moderates user submissions by approving or rejecting uploaded photos before they go live on the site.

## 3. Database Schema Planning
The database uses a standard relational structure with the following main tables:
* **Users Table:** Stores basic account credentials and roles (Admin vs. Regular User).
* **Temples Table:** Stores names, locations, and current statuses (Announced, Under Construction, Dedicated).
* **Photos Table:** Stores the file paths of uploaded images, linked to a specific user ID and temple ID using foreign keys.

## 4. Tech Stack & Architecture
* **Backend:** Node.js with Express
* **Database:** PostgreSQL with the `pg` library
* **Views:** EJS templates styled with clean CSS layouts
* **Architecture:** Strictly follows the Model-View-Controller (MVC) pattern