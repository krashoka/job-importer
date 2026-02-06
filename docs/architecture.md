# Architecture Overview – Job Importer System

This document describes the backend architecture and data flow of the Job Importer application. The goal of the system is to periodically ingest job data from external sources, process it safely at scale, and provide visibility into each import run.

---

## Problem Statement

The application needs to import job postings from external XML feeds on a regular basis. These feeds can contain a large number of records and may change over time (new jobs, updates, or removals). The system must:

- Avoid duplicate job entries
- Handle large volumes of data efficiently
- Track each import execution for auditing and monitoring
- Remain extensible for additional feeds in the future

---

## High-Level Architecture

The system follows an asynchronous, queue-based architecture:

Cron Scheduler
↓
Feed Fetcher (XML)
↓
Feed Normalization
↓
Redis Queue (BullMQ)
↓
Worker Process
↓
MongoDB (jobs, importlogs)


Each component has a single responsibility, which helps keep the system reliable and easy to maintain.

---

## Component Breakdown

### Cron Scheduler
A cron job runs every hour and initiates the import process. It is responsible for triggering the import, not for processing or storing job data.

### Feed Fetcher & Normalizers
External job feeds are fetched in XML format and converted into JSON. Since each feed can have a different structure, a dedicated normalizer is used per feed to map the data into a common internal job format. This keeps feed-specific logic isolated.

### Queue (BullMQ + Redis)
Jobs are pushed into a Redis-backed BullMQ queue instead of being processed immediately. This decouples job ingestion from database writes and allows the system to scale, retry failed jobs, and process data concurrently.

### Worker
The worker runs as a separate process and consumes jobs from the queue. For each job, it performs an idempotent upsert operation in MongoDB. The worker also updates import statistics and handles retries with exponential backoff in case of failures.

### Database (MongoDB)
Two collections are used:
- `jobs`: Stores unique job postings using a compound key of `externalId` and `source`.
- `importlogs`: Stores metadata for each import run, including counts of fetched, new, updated, and failed jobs.

---

## Data Flow

1. The cron scheduler triggers the import process.
2. Job feeds are fetched and parsed from XML.
3. Feed data is normalized into a common structure.
4. Each job is pushed to the Redis queue.
5. The worker consumes jobs and upserts them into MongoDB.
6. Import statistics are updated in the import logs collection.

---

## Key Design Decisions

- **Asynchronous processing** was chosen to handle large datasets without blocking the main server.
- **Queue-based architecture** enables retries, backoff, and horizontal scaling of workers.
- **Idempotent database operations** prevent duplicate job records.
- **Feed normalization layer** ensures the system can support new feeds with minimal changes.

---

## Scalability Considerations

- Multiple workers can be added to process jobs in parallel.
- Redis allows high-throughput queue operations.
- MongoDB indexes ensure fast lookups and deduplication.
- Cron frequency can be adjusted based on load.

---

## Conclusion

This architecture ensures reliable job ingestion, efficient processing, and clear visibility into import operations. It is designed to scale with increasing data volume while remaining maintainable and extensible.